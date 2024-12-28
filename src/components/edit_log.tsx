import * as W from '../../m8-files/pkg/m8_files';
import { EditLog, PanelSide, PatchData, PatchKind, SongRef, State } from "../state";

type WasmLog =
    {
        kind: PatchKind,
        from : number,
        to: number
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

        const song_name = panel.loaded_name.value;
        return [panel.song.value, {side, song_name}];
    }

    private otherSongSide(side : PanelSide) : [W.WasmSong, SongRef] {
        return this.songSide(side === "left" ? "right" : "left");
    }

    private pushLog(l : EditLog) {
        const old_log = this.state.remap_log.value;
        this.state.remap_log.value = [...old_log, l];
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
        switch (log.kind) {
            case "CHN": arr = W.dump_chain(song, log.to); break;
            case "PHR": arr = W.dump_phrase(song, log.to); break;
            case "INS": arr = W.dump_instrument(song, log.to); break;
            case "EQ": arr = W.dump_eq(song, log.to); break;
            case "TBL": arr = W.dump_table(song, log.to); break;
        }

        return {
            kind: log.kind,
            from_id: log.from,
            to_id: log.to,
            data: arr
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
            const patch = objRemapping.map((log) => this.toPatch(to, log));
            W.remap_chain_apply(from, to, remapping, chain, col, line);
            this.pushLog({ kind: "move", from_ref, to_ref, patch });
        } catch(err) {
            this.errLog(to_ref, `Chain copy error: ${err}`);
            return false;
        }

        return true;
    }
}
