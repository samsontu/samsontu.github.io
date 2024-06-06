rem @Echo off

setlocal
set MINIATHENA=C:\MiniATHENA
set JRE="C:\Program Files (x86)\Java\jdk1.6.0_45"

set MAXIMUM_MEMORY=-Xmx1256M
set OPTIONS=%MAXIMUM_MEMORY%
set LIB=%MINIATHENA%\lib
set GUIDELINEFILE="%MINIATHENA%\kb\ATHENA_HTN.pprj"

set PCADIR=%LIB%\plugins\edu.stanford.smi.eon.pca
set PALDIR=%LIB%\plugins\edu.stanford.smi.protegex.pal_tabs
set PATH=%PATH%;%JRE%\bin


set PROTEGEJARS=%LIB%\protege.jar;%LIB%\looks.jar;%LIB%\unicode_panel.jar
set GUIDELINEJARS=%PCADIR%\pca-glinda.jar;%PCADIR%\AthenaPerformanceMetrics.jar;%PALDIR%\pal.jar;%PALDIR%\antlr.jar;%LIB%\jcchart.jar;%LIB%\jctable.jar;%PCADIR%\log4j.jar
set CLASSPATH="%PROTEGEJARS%;%GUIDELINEJARS%"

%JRE%\bin\java %OPTIONS%  -Dprotege.dir="%LIB%"   -cp %CLASSPATH% edu.stanford.smi.eon.clients.ATHENA_Standalone 1316243 %MINIATHENA%\data\1316243.xml %MINIATHENA%\kb\ATHENA_HTN.pprj  %MINIATHENA%\output\ "VA/JNC-VII Hypertension Guideline" HTN.xml


pause