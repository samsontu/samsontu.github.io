@echo off

setlocal
set EONHOME=c:\ATHENA-HTN-Demo
set ATHENAHOME=c:\ATHENA-HTN-Demo
set MAXIMUM_MEMORY=-Xmx200M
set OPTIONS=%MAXIMUM_MEMORY%
set LIB=%EONHOME%\lib
set JRE=%EONHOME%\lib\jre

REM set BOOTPATH="%LIB%\vbjorb.jar;%LIB%\vbjapp.jar;%LIB%\vbjgk.jar;%JRE%\lib\rt.jar"
REM -Xbootclasspath:%BOOTPATH%
set CLASSPATH="%LIB%\plugins\athena-desktop.jar;%LIB%\looks.jar;%LIB%\unicode_panel.jar;%LIB%\hapi-0.4.3.jar;%LIB%\protege.jar;%LIB%\plugins\log4j-1.2.13.jar;%LIB%\plugins\pca-desktop.jar;%LIB%\pinball.jar;%LIB%\plugins\chronusII.jar;%LIB%\plugins\woz.jar;%LIB%\plugins\pal.jar;%LIB%\jcchart.jar;%LIB%\jctable.jar;%LIB%\plugins\antlr.jar"

%JRE%\bin\java %OPTIONS%  -Dprotege.dir="%LIB%"   -cp %CLASSPATH% -DEON_HOME="%EONHOME%" -DATHENA_HOME="%ATHENAHOME%" -DEON_INI_FILE_NAME="ini\hypertensionPA.ini" edu.stanford.smi.protege.Application %EONHOME%\domain_model\athena_hypertension.pprj

pause
