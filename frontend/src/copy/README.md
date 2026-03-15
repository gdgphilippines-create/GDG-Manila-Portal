# Copy Strategy

Copy is static and bundled in `src/copy/`.

This keeps the current frontend simple while establishing one import path for all UI text. If copy moves to a CMS or backend later, the fetch layer can replace these modules without requiring feature-level copy files.
