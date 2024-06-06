'''
Created on Oct 28, 2010
@usage: MRSAExport("C:/Dropbox/VA/CHIRMRSA/ontology/sql/", "MRSAConcept.csv", "MRSATerms.csv", "MRSAHierarchy.csv", "MRSASynonyms.csv")
@usage: MRSAExport("/Users/tu/Dropbox/VA/CHIRMRSA/ontology/sql/", "MRSAConcept.csv", "MRSATerms.csv", "MRSAHierarchy.csv", "MRSASynonyms.csv")
@author: swt
'''
labelProp = kb.getRDFSLabelProperty()
snomedct = kb.getInstance("http://www.va.gov/MRSA.owl#SNOMEDCT")
termRefProp=kb.getOWLObjectProperty("http://www.va.gov/MRSA.owl#terminology_reference")
termRefCls=kb.getOWLNamedClass("http://www.va.gov/MRSA.owl#Terminology_reference")
termSysProp=kb.getOWLObjectProperty("http://www.va.gov/MRSA.owl#terminology_system")
synonymProp=kb.getOWLObjectProperty("http://www.va.gov/MRSA.owl#has_synonym")
stringProp=kb.getOWLDatatypeProperty("http://www.va.gov/MRSA.owl#string")
codeProp=kb.getOWLDatatypeProperty("http://www.va.gov/MRSA.owl#code")
codeSystemProp=kb.getOWLDatatypeProperty("http://www.va.gov/MRSA.owl#code_system")
topCls = kb.getCls("http://www.va.gov/MRSA.owl#MRSA_ontology_concept")
metaCls=kb.getCls("http://www.va.gov/MRSA.owl#Concept_Metaclass")
bioportalProp = kb.getOWLObjectProperty("http://www.va.gov/MRSA.owl#bioportal_reference")
refProp=kb.getOWLObjectProperty("http://www.va.gov/MRSA.owl#literature_reference")
bioportalSNOMED="SNOMED Clinical Terms"
refSNOMED="SNOMEDCT"
bioportalTermIDProp = kb.getSlot("http://www.va.gov/MRSA.owl#termId")
bioportalOntIDProp = kb.getSlot("http://www.va.gov/MRSA.owl#ontologyId")
authorProp = kb.getOWLDatatypeProperty("http://www.va.gov/MRSA.owl#author")
yearProp = kb.getOWLDatatypeProperty("http://www.va.gov/MRSA.owl#year")

def MRSAExport (dir, conceptFile, termRefFile, hierarchyFile, synonymFile):
	conceptOutput = open(dir + conceptFile, 'w')
	termRefOutput = open(dir + termRefFile, 'w')
	hierarchyOutput = open(dir + hierarchyFile, 'w')
	synonymOutput = open(dir + synonymFile, 'w')
	try:
		exportCls(conceptOutput, termRefOutput, hierarchyOutput, synonymOutput, topCls)
	finally:
		hierarchyOutput.close()
		synonymOutput.close()
		conceptOutput.close()
		termRefOutput.close()
	
def exportCls(conceptOutput, termRefOutput, hierarchyOutput, synonymOutput, cls):
	descendants = cls.getNamedSubclasses(1)
	exportConcept(conceptOutput, termRefOutput, cls)
	exportSynonym(synonymOutput, cls)
	if (descendants != None and descendants.size() > 0):
		for child in descendants:
			hierarchyOutput.write(cls.getName()+'\t'+ child.getName()+"\n")
	children = cls.getNamedSubclasses()
	if (children != None and children.size() > 0):
		for child in children:
			exportCls(conceptOutput, termRefOutput, hierarchyOutput, synonymOutput, child)
	
def exportSynonym(synonymOutput, cls):
	synonyms = cls.getOwnSlotValues(synonymProp)
	if (synonyms != None and synonyms.size() > 0):
		for synonym in synonyms:
			string = synonym.getOwnSlotValue(stringProp)
			if (string !=None):
				synonymOutput.write(cls.getName()+'\t' +string+'\n')
				
def exportConcept(conceptOutput, termRefOutput, cls):
	label = cls.getPropertyValue(labelProp)
	if (label == None):
		label = cls.getBrowserText()
	refString = "\t"
	ref= cls.getPropertyValue(refProp)
	if (ref != None):
		author = ref.getPropertyValue(authorProp)
		year = ref.getPropertyValue(yearProp)
		if (author != None):
			if (year != None):
				refString = author+":"+year+"\t"
			else:
				refString = author+"\t"
	conceptOutput.write(label+"\t"+ refString + cls.getName()+"\n")
	# Generate terminology reference output
	termRefs = cls.getPropertyValues(termRefProp)
	for termRef in termRefs:
		termSystem = termRef.getPropertyValue(termSysProp)
		if (termSystem != None):
			codeSystem = termSystem.getPropertyValue(codeSystemProp)
			code = termRef.getPropertyValue(codeProp)
			if ((codeSystem != None) and (code != None)):
				termRefOutput.write(cls.getName()+"\t"+codeSystem +"\t" + code +"\n")
			else:
				print "Error: No code system or code for ", cls.getBrowserText(), " ", termRef.getBrowserText()
		else:
			print "Error: No terminology system for ", termRef.getBrowserText()
