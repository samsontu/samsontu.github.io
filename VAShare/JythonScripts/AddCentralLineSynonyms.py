
cvcCls = kb.getOWLNamedClass("http://www.va.gov/MRSA.owl#Central_venous_catheter")
synProp=kb.getOWLObjectProperty("http://www.va.gov/MRSA.owl#has_synonym")
synCls=kb.getOWLNamedClass("http://www.va.gov/MRSA.owl#Synonym_term")
stringProp = kb.getOWLDatatypeProperty("http://www.va.gov/MRSA.owl#string")

def startCLSynonymImport(fileName):
    input = open(fileName, 'r')
    line = input.readline()
    try:       
		while line != "":
			processLine(line)
			line = input.readline()
    finally:
        input.close()
		
def processLine(line):
	currentSyn = getCurrentSynonyms(cvcCls)
	syn = line.rstrip()
	if (currentSyn.count(syn) == 0):
		inst = synCls.createInstance(kb.createNewResourceName("MRSA"))
		inst.setPropertyValue(stringProp, syn)
		cvcCls.addPropertyValue(synProp, inst)
		
def getCurrentSynonyms(cvcCls):
	syns = cvcCls.getPropertyValues(synProp)
	synStrings = []
	for syn in syns:
		synStrings.append(syn.getPropertyValue(stringProp))
	return synStrings