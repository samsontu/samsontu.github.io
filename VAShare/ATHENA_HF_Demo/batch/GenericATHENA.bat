orem @Echo off

setlocal
set MAXIMUM_MEMORY=-Xmx512M
set OPTIONS=%MAXIMUM_MEMORY%
set EONHOME=**TOPDIR**\ATHENA_HF_Demo
set KBHOME=%EONHOME%\kbs

set LIB=%EONHOME%\lib
set GUIDELINEFILE=%KBHOME%\%1
set TestEnvironmentINI=%EONHOME%\%2


set JRE=%EONHOME%\jre
set PCADIR=%LIB%\plugins\edu.stanford.smi.eon.pca

set PATH=%PATH%;%JRE%\bin


set PROTEGEJARS=%LIB%\protege.jar;%LIB%\looks.jar;%LIB%\unicode_panel.jar
set GUIDELINEJARS=%PCADIR%\eonpm.jar;%PCADIR%\AthenaPerformanceMetrics.jar;%LIB%\plugins\chronusII.jar;%PCADIR%\eonpal.jar;%PCADIR%\antlr.jar;%LIB%\jcchart.jar;%LIB%\jctable.jar;%PCADIR%\log4j.jar
set TESTJARS=%LIB%\jcalendar.jar;%LIB%\gov.va.test.opioidtesttool\EONTestingEnvironment.jar;%LIB%\gov.va.test.opioidtesttool\test.jar
set CLASSPATH="%PROTEGEJARS%;%GUIDELINEJARS%;%TESTJARS%"

%JRE%\bin\java %OPTIONS%  -Dprotege.dir="%LIB%"   -cp %CLASSPATH% -DEON_HOME="%EONHOME%"   -DTestEnvironmentINI="%TestEnvironmentINI%" edu.stanford.smi.protege.Application %GUIDELINEFILE%

pause
