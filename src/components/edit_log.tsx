import * as W from '../../rem8x/pkg/m8_files';
import { EditLog, PanelSide, PatchData, PatchKind, SongRef, State } from "../state";

type WasmLog =
    {
        kind: PatchKind | "SNGSTEP",
        from : number,
        to: number,
        x?: number,
        y?: number
    }

export class UndoRedoer {
    constructor(private readonly state : State) {
    }

    public errLog(ref : SongRef, message : string) {
        this.state.message_banner.value = message;
        this.pushLog({ kind: "error", ref, message })
    }

    private songSide(side: PanelSide) : [W.WasmSong, SongRef] {
        const panel = side === "left"
            ? this.state.left
            : this.state.right;

        const song = panel.song.value;
        const song_name = W.song_name(song);
        return [song, {side, song_name}];
    }

    private otherSongSide(side : PanelSide) : [W.WasmSong, SongRef] {
        return this.songSide(side === "left" ? "right" : "left");
    }

    public undoTo(pos : number) {
        const current = this.state.undo_stack_pointer.value;
        const log = this.state.remap_log.value;

        if (pos === current) return;

        // we are doing a redo operation
        if (pos > current) {
            for (let i = current; i <= pos; i++) {
                this.apply(log[i]);
            }
            this.state.undo_stack_pointer.value = pos + 1;
        } else {
            for (let i = current - 1; i >= pos; i--) {
                this.revApply(log[i]);
            }

            // we are doing an undo operation
            this.state.undo_stack_pointer.value = pos;
        }

        this.state.left.bumper.value = this.state.left.bumper.value + 1;
        this.state.right.bumper.value = this.state.right.bumper.value + 1;
    }

    private pushLog(l : EditLog) {
        const old_log = this.state.remap_log.value;
        const old_pointer = this.state.undo_stack_pointer.value;

        // simple case only append
        if (old_pointer === old_log.length) {
            this.state.undo_stack_pointer.value = old_pointer + 1;
            this.state.remap_log.value = [...old_log, l];
        } else {
            // history branch, we forget events after last undo.
            const new_log = [...old_log.slice(0, old_pointer), l];
            this.state.undo_stack_pointer.value = new_log.length;
            this.state.remap_log.value = new_log;
        }
    }

    public copyPhrase(side: PanelSide, phrase: number) : boolean {
        const [song, from_ref] = this.songSide(side);
        const [other, to_ref] = this.otherSongSide(side);

        if (other === undefined) return;
        try {
            const data = W.dump_phrase(song, phrase);
            W.copy_phrase(song, other, phrase, phrase);
            this.pushLog({
                kind: "move",
                from_ref,
                to_ref,
                patch: [
                    {
                        kind: "PHR",
                        from_id: phrase,
                        to_id: phrase,
                        data
                    }
                ]
            });
        } catch (err) {
            this.errLog(to_ref, err.toString())
        }
        return true;
    }

    public renumberPhrase(side: PanelSide, base_phrase: number, new_phrase) : boolean {
        if (base_phrase === new_phrase) return true;

        const [song, songRef] = this.songSide(side);
        try {
            W.renumber_phrase(song, base_phrase, new_phrase)

            this.pushLog({
              kind: "renumber",
              ref: songRef,
              elemKind: "PHR",
              old_value: base_phrase,
              new_value: new_phrase
            });
        }
        catch (err) {
            this.errLog(songRef, err.toString());
            return false;
        }

        return true;
    }

    public renumberChain(side: PanelSide, base_chain : number, to_chain : number) : boolean {
        if (base_chain === to_chain) return true;

        const [song, songRef] = this.songSide(side);
        try {
          W.renumber_chain(song, base_chain, to_chain)
          this.pushLog({
            kind: "renumber",
            ref: songRef,
            elemKind: "CHN",
            old_value: base_chain,
            new_value: to_chain
          });
        }
        catch (err) {
          this.errLog(songRef, err.toString());
          return false;
        }

        return true;
    }

    public renumberTable(side: PanelSide, base_table: number, to_table: number) : boolean {
        if (base_table === to_table) return true;

        const [song, songRef] = this.songSide(side);

        try {
            W.renumber_table(song, base_table, to_table)
            this.pushLog({
              kind: "renumber",
              ref: songRef,
              elemKind: "TBL",
              old_value: base_table,
              new_value: to_table
            });
        }
        catch (err) {
            this.errLog(songRef, err.toString());
            return false;
        }

        return true;
    }

    public copyTable(side: PanelSide, table: number) {
        const [song, from_ref] = this.songSide(side);
        const [other, to_ref] = this.otherSongSide(side);

        if (other === undefined) return;

        const data = W.dump_table(other, table);
        W.copy_table(song, other, table, table);
        this.pushLog({
            kind: "move",
            from_ref,
            to_ref,
            patch: [
                {
                    kind: "TBL",
                    from_id: table,
                    to_id: table,
                    data
                }
            ]
        });
    }

    public renumberInstrument(side: PanelSide, base_instr : number, to_instr: number) : boolean {
        if (base_instr === to_instr) return true;
        const [song, songRef] = this.songSide(side);

        try {
            W.renumber_instrument(song, base_instr, to_instr)
            this.pushLog({
              kind: "renumber",
              ref: songRef,
              elemKind: "INS",
              old_value: base_instr,
              new_value: to_instr
            });
        }
        catch (err) {
          this.errLog(songRef, err.toString());
          return false;
        }

        return true;
    }

    public copyInstrument(side: PanelSide, instr: number) {
        const [song, from_ref] = this.songSide(side);
        const [other, to_ref] = this.otherSongSide(side);
        if (other === undefined) return;
        const data = W.dump_instrument(other, instr);
        W.copy_instrument(song, other, instr, instr);

        this.pushLog({
            kind: "move",
            from_ref,
            to_ref,
            patch: [
                {
                    kind: "INS",
                    from_id: instr,
                    to_id: instr,
                    data
                }
            ]
        });
    }

    public renumberEq(side: PanelSide, base_eq: number, to_eq: number) : boolean {
        if (base_eq === to_eq) return true;
        const [song, songRef] = this.songSide(side);

        try {
            W.renumber_eq(song, base_eq, to_eq)
            this.pushLog({
              kind: "renumber",
              ref: songRef,
              elemKind: "EQ",
              old_value: base_eq,
              new_value: to_eq
            });
        }
        catch (err) {
          this.errLog(songRef, err.toString());
          return false;
        }

        return true;
    }

    public copyEq(side: PanelSide, eq: number) {
        const [song, from_ref] = this.songSide(side);
        const [other, to_ref] = this.otherSongSide(side);
        if (other === undefined) return;
        const data = W.dump_eq(other, eq);
        W.copy_eq(song, other, eq, eq);
        this.pushLog({
            kind: "move",
            from_ref,
            to_ref,
            patch: [
                {
                    kind: "EQ",
                    from_id: eq,
                    to_id: eq,
                    data
                }
            ]
        });
    }

    public renameInstrument(side: PanelSide, instr: number, new_name: string) {
        const [song, songRef] = this.songSide(side);

        try {
            const old_name = W.instrument_name(song, instr);
            if (old_name === new_name) return;
            W.rename_instrument(song, instr, new_name);

            this.pushLog({
              kind: "rename",
              ref: songRef,
              instr,
              old_name,
              new_name
            });
        }
        catch (err) {
            this.errLog(songRef, err.toString())
        }
    }

    private toPatch(song : W.WasmSong, log: WasmLog) : PatchData {
        let arr : Uint8Array | undefined = undefined;
        let x : number | undefined = undefined;
        let y : number | undefined = undefined;

        switch (log.kind) {
            case "CHN": arr = W.dump_chain(song, log.to); break;
            case "PHR": arr = W.dump_phrase(song, log.to); break;
            case "INS": arr = W.dump_instrument(song, log.to); break;
            case "EQ": arr = W.dump_eq(song, log.to); break;
            case "TBL": arr = W.dump_table(song, log.to); break;
            case "SNGSTEP":
                x = log.x;
                y = log.y;
                break;
        }

        return {
            kind: log.kind,
            from_id: log.from,
            to_id: log.to,
            data: arr,
            pos: x !== undefined && y!== undefined ? { x, y } : undefined
        }
    }

    /** Perform undo operation */
    public revApply(l : EditLog) {
        switch (l.kind) {
            case "error": break;
            case "renumber": {
                let [song, _] = this.songSide(l.ref.side);
                switch (l.elemKind) {
                    case "CHN": W.renumber_chain(song, l.new_value, l.old_value); break;
                    case "PHR": W.renumber_phrase(song, l.new_value, l.old_value); break;
                    case "INS": W.renumber_instrument(song, l.new_value, l.old_value); break;
                    case "EQ": W.renumber_eq(song, l.new_value, l.old_value); break;
                    case "TBL": W.renumber_table(song, l.new_value, l.old_value); break;
                }
                break;
            }

            case "rename": {
                let [song, _] = this.songSide(l.ref.side);
                W.rename_instrument(song, l.instr, l.old_name);
                break;
            }

            case "move": {
                const patches = l.patch;
                const [song, _] = this.songSide(l.to_ref.side);
                for (let i = patches.length - 1; i >= 0; i--) {
                    const patch = patches[i];
                    switch (patch.kind) {
                        case "CHN": W.blast_chain(song, patch.to_id, patch.data); break;
                        case "PHR": W.blast_phrase(song, patch.to_id, patch.data); break;
                        case "INS": W.blast_instrument(song, patch.to_id, patch.data); break;
                        case "EQ": W.blast_eq(song, patch.to_id, patch.data); break;
                        case "TBL": W.blast_table(song, patch.to_id, patch.data); break;
                        case "SNGSTEP": W.set_song_step(song, patch.pos.x, patch.pos.y, patch.from_id); break;
                    }
                }

                break;
            }
        }
    }

    /** Perform redo operation */
    public apply(l : EditLog) {
        switch (l.kind) {
            case "error": break;
            case "renumber": {
                let [song, _] = this.songSide(l.ref.side);
                switch (l.elemKind) {
                    case "CHN": W.renumber_chain(song, l.old_value, l.new_value); break;
                    case "PHR": W.renumber_phrase(song, l.old_value, l.new_value); break;
                    case "INS": W.renumber_instrument(song, l.old_value, l.new_value); break;
                    case "EQ": W.renumber_eq(song, l.old_value, l.new_value); break;
                    case "TBL": W.renumber_table(song, l.old_value, l.new_value); break;
                }
                break;
            }

            case "rename": {
                let [song, _] = this.songSide(l.ref.side);
                W.rename_instrument(song, l.instr, l.new_name);
                break;
            }

            case "move": {
                const patches = l.patch;
                const [from_song, _from_name] = this.songSide(l.from_ref.side);
                const [to_song, _to_name] = this.songSide(l.to_ref.side);
                for (const patch of patches) {
                    switch (patch.kind) {
                        case "CHN": W.copy_chain_raw(from_song, to_song, patch.from_id, patch.to_id); break;
                        case "PHR": W.copy_phrase(from_song, to_song, patch.from_id, patch.to_id); break;
                        case "INS": W.copy_instrument(from_song, to_song, patch.from_id, patch.to_id); break;
                        case "EQ": W.copy_eq(from_song, to_song, patch.from_id, patch.to_id); break;
                        case "TBL": W.copy_table(from_song, to_song, patch.from_id, patch.to_id); break;
                        case "SNGSTEP": W.set_song_step(to_song, patch.pos.x, patch.pos.y, patch.to_id); break;
                    }
                }

                break;
            }
        }
    }

    public copyChain(
        from_song: PanelSide,
        chain: number,
        col : number,
        line: number) : boolean {

        const [from, from_ref] = this.songSide(from_song);
        const [to, to_ref] = this.otherSongSide(from_song);

        try {
            const remapping = W.remap_chain(from, to, chain);
            const objRemapping : WasmLog[] = W.describe_mapping(remapping);
            const old_sng = W.pick_song_step(to, col, line);
            W.remap_chain_apply(from, to, remapping, chain, col, line);

            objRemapping.push({
                kind: "SNGSTEP",
                from: old_sng,
                to: W.pick_song_step(to, col, line),
                x: col,
                y: line
            });
            const patch = objRemapping.map((log) => this.toPatch(to, log));
            this.pushLog({ kind: "move", from_ref, to_ref, patch });
        } catch(err) {
            this.errLog(to_ref, `Chain copy error: ${err}`);
            return false;
        }

        return true;
    }
}
