rem @Echo off

setlocal
set MAXIMUM_MEMORY=-Xmx512M
set OPTIONS=%MAXIMUM_MEMORY%
set EONHOME=C:\Users\tu\Dropbox\ATHENATestEnvironment
set KBHOME=C:\Users\tu\Dropbox\ATHENATestEnvironment\kbs
set LIB=%EONHOME%\lib
set GUIDELINEFILE=%KBHOME%\%1
set TestEnvironmentINI=%EONHOME%\%2


set JRE=%EONHOME%\jre7
set PCADIR=%LIB%\plugins\edu.stanford.smi.eon.pca

set PATH=%PATH%;%JRE%\bin


set PROTEGEJARS=%LIB%\protege.jar;%LIB%\looks.jar;%LIB%\unicode_panel.jar;%LIB%\jcalendar.jar;%LIB%\lax.jar
set GUIDELINEJARS=%PCADIR%\eonpm.jar;%PCADIR%\AthenaPerformanceMetrics.jar;%PCADIR%\eonpal.jar;%PCADIR%\antlr.jar;%LIB%\jcchart.jar;%LIB%\jctable.jar;%PCADIR%\log4j.jar
set CLASSPATH="%PROTEGEJARS%;%GUIDELINEJARS%"

%JRE%\bin\java %OPTIONS%  -Dprotege.dir="%LIB%"   -cp %CLASSPATH% -DEON_HOME="%EONHOME%"   -DTestEnvironmentINI="%TestEnvironmentINI%" edu.stanford.smi.protege.Application %GUIDELINEFILE%

pause

