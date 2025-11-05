# 0.10.1

 - Fixed hypersynth chord information

# 0.10

 - FW 6.2 support

# 0.9

 - Allow loading instrument files within rem8xer.

# 0.8

 - Revisited copy algorithm to handle command referencing instruments and
   tables. We are now following:

     * `INS` command: to switch command (if you use it with `RNL` or other random command,
       this won't be taken into account).
     * `NXT` command: spawning another command
     * `TBX` command: external table
     * `EQI` command: override equalizer
     * `EQM` command: mixer equalizer

   Instrument tables and external tables are now scanned recursively.

# 0.7

 - FW 6.0 support

# 0.6

 - M8 Firmware 5.0 support
 - Aligning with m8-files upstream

# 0.5.1

 - Fix: botchered EQ writing in file...
 - Fix: some refresh issue in chain copy

# 0.5

 - Fix: handling of invalid utf-8 characters in song name.
 - Added: "spectraview" showing eq plots of all instruments
          and some basic parameters usefull for mixing

# 0.4

 - Eq viewing and plotting.

# 0.3
 
 - Song explorer view
 - Instrument number renumbering using the song explorer
 - Instrument renaming
 - Phrase renumbering

# 0.2

 - Changing allocation policy to try to keep chain & phrase number
 - allow renumber chain number
 - Adding remapping log

# 0.1

 - Initial version

