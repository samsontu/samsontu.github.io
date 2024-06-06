@Echo off

setlocal
set MAXIMUM_MEMORY=-Xmx1256M
set OPTIONS=%MAXIMUM_MEMORY%
set GLINDAHOME=C:\projects\eclipse\glinda
set LIB=%GLINDAHOME%\lib
set OWLDIR=%LIB%\plugins\edu.stanford.smi.protegex.owl

set JRE="%JAVA_HOME%"
set PCADIR=%LIB%\plugins\edu.stanford.smi.eon.pca
set PATH=%PATH%;%JRE%\bin

set GUIDELINEJARS=%PCADIR%\pal.jar;%PCADIR%\antlr.jar;%PCADIR%\log4j.jar
set GLINDAJARS=%LIB%\glinda.jar;%LIB%\JRI.jar;%LIB%\hsqldb.jar;%LIB%\looks-2.1.3.jar;%LIB%\JRIEngine.jar;%LIB%\http.jar;%LIB%\looks.jar;%LIB%\REngine.jar;%LIB%\iiop.jar;%LIB%\mysql-connector-java-3.0.17-ga-bin.jar;%LIB%\Rserve.jar;%LIB%\jade.jar;%LIB%\protege.jar;%LIB%\axis.jar;%LIB%\jadeTools.jar;%LIB%\swrl-api.jar;%LIB%\chronusII.jar;%LIB%\jcalendar.jar;%LIB%\unicode_panel.jar;%LIB%\driver.jar;%LIB%\junit.jar;%LIB%\lax.jar
set OWLJARS=%OWLDIR%\antlr-2.7.5.jar;%OWLDIR%\iri.jar;%OWLDIR%\orphanNodesAlg.jar;%OWLDIR%\arq-extra.jar;%OWLDIR%\jcalendar.jar;%OWLDIR%\owlsyntax.jar;%OWLDIR%\arq.jar;%OWLDIR%\jdom.jar;%OWLDIR%\protege-owl.jar;%OWLDIR%\axis.jar;%OWLDIR%\jena.jar;%OWLDIR%\stax-api-1.0.jar;%OWLDIR%\commons-discovery-0.4.jar;%OWLDIR%\jep-2.4.0.jar;%OWLDIR%\swingx-1.0.jar;%OWLDIR%\commons-lang-2.0.jar;%OWLDIR%\jess.jar;%OWLDIR%\swrl-jess-bridge.jar;%OWLDIR%\commons-logging-1.1.1.jar;%OWLDIR%\json.jar;%OWLDIR%\wstx-asl-3.0.0.jar;%OWLDIR%\concurrent.jar;%OWLDIR%\junit.jar;%OWLDIR%\xercesImpl.jar;%OWLDIR%\edtftpj-1.5.2.jar;%OWLDIR%\kazuki.jar;%OWLDIR%\xml-apis.jar;%OWLDIR%\ekitspell.jar;%OWLDIR%\log4j-1.2.12.jar;%OWLDIR%\icu4j_3_4.jar;%OWLDIR%\lucene-core-2.3.1.jar
set CLASSPATH=%GUIDELINEJARS%;%GLINDAJARS%;%OWLJARS%;%LIB%\commons-dodec\commons-codec-1.3.jar

%JRE%\bin\java %OPTIONS%  -Dprotege.dir="%LIB%"   -cp %CLASSPATH%  edu.stanford.biostorm.test.TestGLINDAMain bmir-glinda.stanford.edu:5200 "Samson Tu" samson GLINDATaskMethod bmir-glinda.stanford.edu:3306/glinda glinda glinda dir 20 200
pause