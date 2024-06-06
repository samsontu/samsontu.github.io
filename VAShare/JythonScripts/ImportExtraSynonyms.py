from edu.stanford.smi.protege.model import Project
kb2path = "c:/Dropbox/VA/CHIRMRSA/MRSA_ontology.pprj"
p = Project.loadProjectFromFile(kb2path, [])
kb2 = p.getKnowledgeBase()

synonymProp = kb.getOWLObjectProperty("http://www.va.gov/MRSA.owl#has_synonym")
synonymProp2 = kb2.getOWLObjectProperty("http://www.va.gov/MRSA.owl#has_synonym")
stringProp1 = kb.getRDFProperty("http://www.va.gov/MRSA.owl#string")
stringProp2 = kb2.getRDFProperty("http://www.va.gov/MRSA.owl#string")
synonymCls = kb.getOWLNamedClass("http://www.va.gov/MRSA.owl#Synonym_term")
dataProperties2 = kb2.getUserDefinedOWLDatatypeProperties()

testCls= kb.getOWLNamedClass("http://www.va.gov/MRSA.owl#Uterus")
testCls2=kb2.getOWLNamedClass("http://www.va.gov/MRSA.owl#Uterus")
syn1s = testCls.getPropertyValues(synonymProp)
syn2s = testCls2.getPropertyValues(synonymProp2)

def addExtraSynonyms(kb1, kb2, topClsName):
	topCls=kb1.getOWLNamedClass(topClsName)
	if (topCls):
		subs = topCls.getSubclasses(1)
		for sub in subs:
			subInKB2 = kb2.getOWLNamedClass(sub.getName())
			if (subInKB2):
				syn1s = sub.getPropertyValues(synonymProp)
				syn1Strings = map((lambda x: x.getPropertyValue(stringProp1)), syn1s)
				syn2s = subInKB2.getPropertyValues(synonymProp2)
				for syn2 in syn2s:
					if (not (syn2.getPropertyValue(stringProp2) in syn1Strings)):
						newSyn = synonymCls.createInstance(None)
						copyInstance(newSyn, syn2)
						sub.addPropertyValue( synonymProp, newSyn)

def copyInstance(newSyn, syn2):
	for dataProperty2 in dataProperties2:
		if (syn2.getPropertyValueCount(dataProperty2) > 0):
			prop1=kb.getRDFProperty(dataProperty2.getName())
			newSyn.setPropertyValue(prop1, syn2.getPropertyValue(dataProperty2))

def checkClasses(kb1, kb2, topClassName):
	topCls=kb1.getOWLNamedClass(topClsName)
	subs1Strings = map((lambda x: x.getName()), topCls.getSubclasses(1))
	subs2 = kb2.getOWLNamedClass(topClsName).getSubclasses(1)
	for sub2 in subs2:
		if (not (sub2.getName() in subs1Strings)):
			print sub2.getName()

