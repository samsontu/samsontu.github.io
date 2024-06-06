
REM Replace NewPathToTopDirectoryWithBackwardSlash with path to ATHENA_HF_Demo (e.g., E:\\Foo, if E:\Foo\ATHENA_HF_Demo is the location of the installed folder)
REM Replace NewPathToTopDirectoryWithForwardSlash with path to ATHENA_HF_Demo (e.g., E:/Foo, if E:\Foo\ATHENA_HF_Demo is the location of the installed folder)

".\fnr.exe" --cl --dir "NewPathToTopDirectory\ATHENA_HF_Demo\batch" --fileMask "*.bat" --find "**TOPDIR**" --replace "NewPathToTopDirectoryWithBackwardSlash"
".\fnr.exe" --cl --dir "NewPathToTopDirectory\ATHENA_HF_Demo\ini" --fileMask "*.ini"  --find "**TOPDIR**" --replace "NewPathToTopDirectoryWithForwardSlash"