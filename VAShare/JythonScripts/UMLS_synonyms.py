'''
Created on Aug 14, 2009

@author: swt
'''


_hasSynonymProperty = kb.getOWLObjectProperty("has_synonym")
_preferredNameProperty=kb.getOWLDatatypeProperty("preferred_term")
_synonymClass=kb.getOWLNamedClass('Synonym_term')
_UMLS='UMLS'
_synonymLanguage='en'
_codeProperty=kb.getOWLDatatypeProperty('code')
_termReferenceProperty=kb.getOWLObjectProperty('terminology_reference')
_litReferenceProperty=kb.getOWLObjectProperty('literature_reference')
_topClass = kb.getOWLNamedClass('MRSA_ontology_concept')
_synonymStringProperty=kb.getOWLDatatypeProperty('string')
_codeSystemProperty=kb.getOWLDatatypeProperty('code_system')
_termSystemProperty=kb.getOWLObjectProperty("http://www.va.gov/MRSA.owl#terminology_system")
# _termSystemProperty=kb.getOWLObjectProperty("has_terminology_system")
_bioportalProperty = kb.getOWLObjectProperty("http://www.va.gov/MRSA.owl#bioportal_reference")
_shortTermIDProp=kb.getRDFProperty("http://bioportal.bioontology.org#shortTermId")
_SNOMEDCTLabel = "SNOMED Clinical Terms"
_ontologyLabelProp = kb.getRDFProperty("http://bioportal.bioontology.org#ontologyLabel")
_termRefCls=kb.getOWLNamedClass("http://www.va.gov/MRSA.owl#Terminology_reference")
_SNOMEDCTTermSystemRef = kb.getOWLIndividual("http://www.va.gov/MRSA.owl#SNOMEDCT")
_UMLSTermSystemRef = kb.getOWLIndividual("http://www.va.gov/MRSA.owl#UMLS")


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

##########################################################
# Generic usages
#
# map(addBioportalTermAnnotation, _topClass.getSubclasses(1))
# addCUIBasedOnSNOMEDCT()
# getUMLSSynonyms()
	
	
##########################################################
# Finding concepts with no terminology reference
def findConceptsWOTermRef(topCls):
	subclasses = topCls.getSubclasses()
	noTermRef = []
	for sub in subclasses:
		if (hasNoTermRef(sub)):
			noTermRef.append(sub.getBrowserText())
	return noTermRef

def hasNoTermRef(cls):
	termRefs = collection2List(cls.getPropertyValues(_termReferenceProperty))
	bioportalRef= collection2List(cls.getOwnSlotValues(_bioportalProperty))
	if ((termRefs == []) and (bioportalRef == [])):
		return 1
	else:
		return 0

##########################################################
# Finding concepts with no literature reference
def findConceptsWOLitRef(topCls):
	subclasses = topCls.getSubclasses()
	noLitRef = []
	for sub in subclasses:
		if (hasNoLitef(sub)):
			noLitRef.append(sub.getBrowserText())
	return noLitRef

def hasNoLitef(cls):
	litRefs = collection2List(cls.getPropertyValues(_litReferenceProperty))
	if (litRefs == []):
		return 1
	else:
		return 0

###########################################################
# Adding terminology annotations from Bioportal references

def addBioportalTermAnnotation(cls):
	termRefs = collection2List(cls.getPropertyValues(_termReferenceProperty))
	bioportalRef= collection2List(cls.getOwnSlotValues(_bioportalProperty))
	if (termRefs == [] and (bioportalRef != [])):
		for ref in bioportalRef:
			ontologyLabel = ref.getPropertyValue(_ontologyLabelProp)
			if (ontologyLabel == _SNOMEDCTLabel):
				id = ref.getPropertyValue(_shortTermIDProp)
				snomedRef = matchTermref(_SNOMEDCTTermSystemRef, id)
				if (snomedRef == None):
					addNewTermReference(cls, _SNOMEDCTTermSystemRef, id)
				else:
					cls.setPropertyValue(_termReferenceProperty, snomedRef)

def addNewTermReference(cls, terminologyRef, id):
	termdRef = _termRefCls.createOWLIndividual(None)
	termdRef.setPropertyValue(_termSystemProperty, terminologyRef)
	termdRef.setPropertyValue(_codeProperty, id)
	cls.addPropertyValue(_termReferenceProperty, termdRef)
					
def matchTermref(conceptSystem, conceptID):
	refs = _termRefCls.getInstances()
	for ref in refs:
		id = ref.getPropertyValue(_codeProperty)
		termSystem=ref.getPropertyValue(_termSystemProperty)
		if ((termSystem == conceptSystem) and(conceptID == id)):
			return ref
	return None

#################################################
# Deleting existing UMLS synonyms

def deleteUMLSSynonym(cls):
	synonyms=cls.getPropertyValues(_hasSynonymProperty)
	for synonym in synonyms:
		source = synonym.getPropertyValue(_codeSystemProperty)
		if (source == _UMLS):
			synonym.delete()

# Usage  map(deleteUMLSTerm, _synonymClass.getInstances())
def deleteUMLSTerm(inst):
	source = inst.getPropertyValue(_codeSystemProperty)
	if (source == _UMLS):
		inst.delete()
			
####################################################################
def openDB(db, user, pword):
    from com.ziclix.python.sql import zxJDBC
    d, u, p, v ="jdbc:mysql://localhost:3306/"+db , user, pword, "com.mysql.jdbc.Driver"
#    d, u, p, v ="jdbc:odbc:localhost", user, pword, "sun.jdbc.odbc.JdbcOdbcDriver"
    db=zxJDBC.connect(d, u, p, v)
    return db

def getSynonyms(db, cui):
    syms = []
    sql = "select distinct str, sui FROM mrconso where cui='%s' and LAT='ENG'" % (cui)
    symcursor=db.cursor()
    symcursor.execute(sql)
    syms = syms + symcursor.fetchall()
    symcursor.close()
    return syms

#####################################################
# Set CUIs for concepts
# Usage:
# doUMLSOperationForCls(lambda(x)

def addCUIBasedOnSNOMEDCT():
	db=openDB('umls', 'root', '')
	map(lambda x: addToClsCUIBasedOnSNOMEDCT(x, db), _topClass.getSubclasses(1))
	db.close()


def addToClsCUIBasedOnSNOMEDCT(cls, db):
	termRefs = collection2List(cls.getOwnSlotValues(_termReferenceProperty))
	for termRef in termRefs:
		codeSystem = termRef.getOwnSlotValue(_termSystemProperty)
		code = termRef.getOwnSlotValue(_codeProperty)
		if (codeSystem == _SNOMEDCTTermSystemRef):
			putCUIReference(cls, getCUI(db, codeSystem, code))
 

def getCUI(db, termSystem, ID):
    terminology = termSystem.getPropertyValue(_codeSystemProperty)
    cuiQuery = "select distinct cui from mrconso where sab='%s' and SCUI='%s';" % (terminology, ID)
    c = db.cursor()
    c.execute(cuiQuery)
    rs=c.fetchall()
    c.close
    result = []
    for cui in rs:
        result.append(cui[0])
    return result

def putCUIReference(cls, cuis):
	if (len(cuis) == 0):
		print "No CUI for "+cls.getBrowserText()
	else:
		for cui in cuis:
			if (not (CUIAlreadyReferenced(cls, cui))):
				UMLSRef = matchTermref(_UMLSTermSystemRef, cui)
				if (UMLSRef == None):
					addNewTermReference(cls, _UMLSTermSystemRef, cui)
				else:
					cls.addPropertyValue(_termReferenceProperty, UMLSRef)
					
def CUIAlreadyReferenced(cls, cui):
	termRefs = collection2List(cls.getOwnSlotValues(_termReferenceProperty))
	for termRef in termRefs:
		codeSystem = termRef.getOwnSlotValue(_termSystemProperty)
		code = termRef.getOwnSlotValue(_codeProperty)
		if ((codeSystem == _UMLSTermSystemRef) and (code == cui)):
			return 1
	return 0


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
        synonyms = cls.getOwnSlotValue(_hasSynonymProperty)
        for synonym in synonyms:
            putTerm(cls, _hasSynonymProperty, 'Horan', 'en', synonym, '000')

def removeSynonym (cls, comparisonTermCode):
    synonyms = cls.getOwnSlotValues(_hasSynonymProperty)
    if synonyms:
        for syn in synnonyms:
            if (syn.getOwnSlotValue(_synonymStringProperty) == comparisonTermCode[0]):
                cls.removeOwnSlotValue(_synonymStringProperty, syn)
    return None
'''
If replace=1, replace synonyms that have matching strings
else add only new synonym entries.
Global vars: _topClass, _termReferenceProperty, codeSytstemProperty, _codeProperty, 
             _hasSynonymProperty
'''
	
def  getUMLSSynonyms():
    map(deleteUMLSTerm, _synonymClass.getInstances())
    db=openDB('umls', 'root', '')
    classes = _topClass.getSubclasses(1)
    for cls in classes:
        termRefs = collection2List(cls.getOwnSlotValues(_termReferenceProperty))
        for termRef in termRefs:
            codeSystem = termRef.getOwnSlotValue(_termSystemProperty)
            code = termRef.getOwnSlotValue(_codeProperty)
            if (codeSystem == _UMLSTermSystemRef):
                synonyms = getSynonyms(db, code)
                if (synonyms != None):
                    for syn in synonyms:
                        oldSynonym=isThereAlready(cls, syn)
                        if (oldSynonym ==None):
                            putTerm(cls, _hasSynonymProperty, _UMLS, _synonymLanguage, syn[0], syn[1] )
                        else:
                            oldSynonym.setOwnSlotValue(_codeProperty, syn[1])
                            oldSynonym.setOwnSlotValue(_codeSystemProperty, _UMLS)
    db.close()
    
# One-time clean up of non-standard usages
def cleanUp():
    classes = _topClass.getSubclasses(1)
    for cls in classes:
        termRefs = cls.getOwnSlotValues(_termReferenceProperty)
        if (termRefs != None):
            for termRef in termRefs:
                if (termRef.getOwnSlotValue(_codeSystemProperty) == "SNOMED_CT"):
                    termRef.setOwnSlotValue(_codeSystemProperty, "SNOMEDCT")
        synonyms = cls.getOwnSlotValues(_hasSynonymProperty)
        if (synonyms != None):
            for syn in synonyms:
                if (syn.rfind("_") > 0):
                    normalized = syn.replace("_", " ")
                    cls.removeOwnSlotValue(_hasSynonymProperty, syn)
                    cls.addOwnSlotValue(_hasSynonymProperty, normalized)
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
                if (codeSystem == 'UMLS'):
                    synonyms = getSynonyms(db, code)
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
                
# def fixTermReferences():
    # _SNOMEDCTRef = kb.getOWLIndividual("SNOMEDCT")
    # termRefCls = kb.getOWLNamedClass("Terminology_reference")
    
    # kb.getOWLObjectProperty("has_terminology_system")
    # classes = _topClass.getSubclasses(1)
    # for cls in classes:
        # termRefs = cls.getPropertyValues(_termReferenceProperty)
        # termRefs = collection2List(termRefs)
        # if (termRefs != []):
            # for termRef in termRefs:
                # newRef = termRefCls.createOWLIndividual(None)
                # newRef.setPropertyValue(_codeProperty, termRef.getPropertyValue(_codeProperty))
                # if (termRef.getPropertyValue(_preferredNameProperty) != None):
                    # newRef.setPropertyValue(_preferredNameProperty, termRef.getPropertyValue(_preferredNameProperty))
                # if (termRef.getPropertyValue(_codeSystemProperty) == "SNOMEDCT"):
                    # newRef.setPropertyValue(_termSystemProperty, _SNOMEDCTRef)
                # cls.removePropertyValue(_termReferenceProperty, termRef)
                # cls.addPropertyValue(_termReferenceProperty, newRef)