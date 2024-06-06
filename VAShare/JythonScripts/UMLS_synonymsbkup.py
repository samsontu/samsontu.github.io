'''
Created on Aug 14, 2009

@author: swt
'''

_hasSynonymProperty = kb.getOWLObjectProperty("has_synonym")
_preferredNameProperty=kb.getOWLDatatypeProperty("preferred_term")
_synonymClass=kb.getOWLNamedClass('Synonym_term')
_synonymSource='UMLS'
_synonymLanguage='en'
_codeProperty=kb.getOWLDatatypeProperty('code')
_termReferenceProperty=kb.getOWLObjectProperty('terminology_reference')
_topClass = kb.getOWLNamedClass('MRSA_ontology_concept')
_synonymStringProperty=kb.getOWLDatatypeProperty('string')
_codeSystemProperty=kb.getOWLDatatypeProperty('code_system')
_termSystemProperty=kb.getOWLObjectProperty("has_terminology_system")

def complement (whole, part):
    complement_dict = {}
    part_dict = {}
    for e in part:
        part_dict[e] = 1
    for e in whole:
        if not part_dict.has_key(e):
            complement_dict[e] = 1
    return complement_dict.keys()


def collection2List(collection):
  if (collection != None):
    array=collection.toArray()
    L=[]
    for item in array:
      L.append(item)
    return L
  else:
    return []

def openDB(db, user, pword):
    from com.ziclix.python.sql import zxJDBC
    d, u, p, v ="jdbc:mysql://localhost:3306/"+db , user, pword, "com.mysql.jdbc.Driver"
#    d, u, p, v ="jdbc:odbc:localhost", user, pword, "sun.jdbc.odbc.JdbcOdbcDriver"
    db=zxJDBC.connect(d, u, p, v)
    return db

def getSynonyms(db, terminology, ID):
    cuiQuery = "select distinct cui from mrconso where sab='%s' and SCUI='%s';" % (terminology, ID)
    c = db.cursor()
    c.execute(cuiQuery)
    rs=c.fetchall()
    c.close
    syms = []
    for cui in rs:
        sql = "select distinct str, sui FROM mrconso where cui='%s' and LAT='ENG'" % (cui)
        symcursor=db.cursor()
        symcursor.execute(sql)
        syms = syms + symcursor.fetchall()
        symcursor.close()
    return syms
    
def putTerm(frame, property, terminology, language, term, code):
    '''
    Add termsui as a value of property in frame
    '''
    synonym =kb.createInstance(None, _synonymClass )
    synonym.setOwnSlotValue(_codeProperty, code)
    synonym.setOwnSlotValue(_synonymStringProperty, term )
    synonym.setOwnSlotValue(_codeSystemProperty, terminology)
    frame.addOwnSlotValue(_hasSynonymProperty, synonym)
    
def isThereAlready(cls, termsui):
    synonyms = cls.getOwnSlotValues(_hasSynonymProperty)
    if (synonyms != None):
        s = collection2List(synonyms)
        for syn in s:
            if (syn.getOwnSlotValue(_synonymStringProperty) == termsui[0]):
                return syn
    return None
    
def convertStringSynonyms():
    classes = _topClass.getSubclasses()
    for cls in classes:
        synonyms = cls.getOwnSlotValue(_synonymProperty)
        for synonym in synonyms:
            putTerm(cls, _synonymProperty, 'Horan', 'en', synonym, '000')

def removeSynonym (cls, comparisonTermCode):
    synonyms = cls.getOwnSlotValues(_synonymProperty)
    if synonyms:
        for syn in synnonyms:
            if (syn.getOwnSlotValue(_synonymStringProperty) == comparisonTermCode[0]):
                cls.removeOwnSlotValue(_synonymStringProperty, syn)
    return None
'''
If replace=1, replace synonyms that have matching strings
else add only new synonym entries.
Global vars: _topClass, _termReferenceProperty, codeSytstemProperty, _codeProperty, 
             _synonymProperty
'''
def  getUMLSSynonyms():
    db=openDB('umls', 'newuser', 'newuser')
    classes = _topClass.getSubclasses(1)
    for cls in classes:
        termRefs = cls.getOwnSlotValues(_termReferenceProperty)
        if (termRefs != None):
            termRefs =     collection2List(termRefs)
            for termRef in termRefs:
                codeSystem = termRef.getOwnSlotValue(_codeSystemProperty)
                code = termRef.getOwnSlotValue(_codeProperty)
                if (codeSystem == 'SNOMEDCT'):
                    synonyms = getSynonyms(db, codeSystem, code)
                    if (synonyms != None):
                        for syn in synonyms:
                            oldSynonym=isThereAlready(cls, syn)
                            if (oldSynonym ==None):
                                putTerm(cls, _synonymProperty, _synonymSource, _synonymLanguage, syn[0], syn[1] )
                            else:
                                oldSynonym.setOwnSlotValue(_codeProperty, syn[1])
                                oldSynonym.setOwnSlotValue(_codeSystemProperty, _synonymSource)
    db.close()
    

def cleanUp():
    classes = _topClass.getSubclasses(1)
    for cls in classes:
        termRefs = cls.getOwnSlotValues(_termReferenceProperty)
        if (termRefs != None):
            for termRef in termRefs:
                if (termRef.getOwnSlotValue(_codeSystemProperty) == "SNOMED_CT"):
                    termRef.setOwnSlotValue(_codeSystemProperty, "SNOMEDCT")
        synonyms = cls.getOwnSlotValues(_synonymProperty)
        if (synonyms != None):
            for syn in synonyms:
                if (syn.rfind("_") > 0):
                    normalized = syn.replace("_", " ")
                    cls.removeOwnSlotValue(_synonymProperty, syn)
                    cls.addOwnSlotValue(_synonymProperty, normalized)
                else:
                    normalized = syn
                syminstance = kb.createInstance(None, _synonymClass)
                syminstance.setOwnSlotValue(_synonymStringProperty, normalized)
                cls.addOwnSlotValue(_hasSynonymProperty, syminstance)


def compareSynonyms():
    db=openDB('umls', 'newuser', 'newuser')
    stringProp=kb.getOWLDatatypeProperty("string")
    compareFile=open("c:/synonyms.txt", "w")
    classes = _topClass.getSubclasses(1)
    for cls in classes:
        synonymsInClass = cls.getOwnSlotValues(_hasSynonymProperty)
        compareFile.write("\n\n"+ cls.getName()+ "\nSynonyms in class")
        if (synonymsInClass != None):
            synonymsInClass = collection2List(synonymsInClass)
            synonymsInClass.sort() 
            compareFile.write(" ("+ str(len(synonymsInClass))+ ")\n")
            compareFile.write(str(map (lambda x: x.getOwnSlotValue(stringProp), synonymsInClass))+ "\n")
        else:
            compareFile.write("\n")
        termRefs = cls.getOwnSlotValues(_termReferenceProperty)
        if (termRefs != None):
            for termRef in termRefs:
                codeSystem = termRef.getOwnSlotValue(_codeSystemProperty)
                code = termRef.getOwnSlotValue(_codeProperty)
                if (codeSystem == 'SNOMEDCT'):
                    synonyms = getSynonyms(db, codeSystem, code)
                    s= map(lambda x : x[0], synonyms)
                    s.sort()
                    compareFile.write(str( s))
                    if (len(s)!= len(synonymsInClass)):
                        compareFile.write("***** unequal number of synonyms UMLS# = "+str(len(s))+"\n")
                        if (len(s) > len(synonymsInClass)):
                            compareFile.write("@@@@ More synonyms in UMLS\n")
                            diff = complement(s, map (lambda x: x.getOwnSlotValue(stringProp), synonymsInClass))
                            compareFile.write("$$$$ "+ str(diff))
    db.close()
    compareFile.close()
    
def displaySynonyms():
    stringProp=kb.getOWLDatatypeProperty("string")
    compareFile=open("c:/MRSR_synonyms.txt", "w")
    classes = _topClass.getSubclasses(1)
    for cls in classes:
        synonymsInClass = cls.getOwnSlotValues(_hasSynonymProperty)
        compareFile.write(cls.getBrowserText())
        if (synonymsInClass != []):
            synonymsInClass = collection2List(synonymsInClass)
            synonymsInClass.sort() 
            #compareFile.write(" ("+ str(len(synonymsInClass))+ ")\n")
            for s in synonymsInClass:
                compareFile.write("\n\t" + str(s.getOwnSlotValue(stringProp)))
        else:
            compareFile.write("\n\tNo synonym")
        compareFile.write("\n")
                
def fixTermReferences():
    SNOMEDCTRef = kb.getOWLIndividual("SNOMEDCT")
    termRefCls = kb.getOWLNamedClass("Terminology_reference")
    
    kb.getOWLObjectProperty("has_terminology_system")
    classes = _topClass.getSubclasses(1)
    for cls in classes:
        termRefs = cls.getPropertyValues(_termReferenceProperty)
        termRefs = collection2List(termRefs)
        if (termRefs != []):
            for termRef in termRefs:
                newRef = termRefCls.createOWLIndividual(None)
                newRef.setPropertyValue(_codeProperty, termRef.getPropertyValue(_codeProperty))
                if (termRef.getPropertyValue(_preferredNameProperty) != None):
                    newRef.setPropertyValue(_preferredNameProperty, termRef.getPropertyValue(_preferredNameProperty))
                if (termRef.getPropertyValue(_codeSystemProperty) == "SNOMEDCT"):
                    newRef.setPropertyValue(_termSystemProperty, SNOMEDCTRef)
                cls.removePropertyValue(_termReferenceProperty, termRef)
                cls.addPropertyValue(_termReferenceProperty, newRef)