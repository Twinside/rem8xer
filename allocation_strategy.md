# Rem8xer allocation strategy

So the current allocation policy, that is implemented to move bunch of
chain even if the GUI currently only allows to copy one chain at a
time is:

List all instruments that need to be copied that are present in phrase
referenced by chain to be moved, then
  

 * Try to find an exact copy in the destination song, if so reuse this
   number (deduplication phase)
   - if not allocate the instrument on the first "None" instrument
     found starting from zero (policy to be changed),


Then for all phrases that need to be copied:
 

 * Apply the instrument substitution of the previous phrase,
 * try to find an exact copy of the phrase in the destination song,
   deduplication strikes again,
 * again allocate in the first "non-referenced" phrase (if you have
   hanging non-referenced phrase in the destination song, I can wreck
   them, yay :)),


Finally for the chains

 * Apply the phrase substitution of the previous phrase,
 * Again deduplication,
 * Again first non-referenced chain (again chaos if your chain 01 is not
   referenced but has stuff in it),


if all goes well we have a list of substitution/move to perform and we can go
on and apply them. Yes it's lengthy, but the non-atomic copy that must stop
in the end because there is no more available slots in the destination song
seems worse.

