'''
Created on Oct 28, 2010
@usage: startMRSAImport("/Users/tu/Dropbox/VA/CHIRMRSA/doc/MRSA_domain expert_concepts_SNOMED_SMreviewed.csv")
@author: swt
'''

labelProp = kb.getRDFSLabelProperty()
snomedct = kb.getInstance("http://www.va.gov/MRSA.owl#SNOMEDCT")
termRefProp=kb.getOWLObjectProperty("http://www.va.gov/MRSA.owl#terminology_reference")
termRefCls=kb.getOWLNamedClass("http://www.va.gov/MRSA.owl#Terminology_reference")
termSysProp=kb.getOWLObjectProperty("http://www.va.gov/MRSA.owl#terminology_system")
codeProp=kb.getOWLDatatypeProperty("http://www.va.gov/MRSA.owl#code")
topCls = kb.getCls("http://www.va.gov/MRSA.owl#Entity")
metaCls=kb.getCls("http://www.va.gov/MRSA.owl#Concept_Metaclass")


def setLabelProperty():
    subs =topCls.getSubclasses()
    for sub in subs:
        label=sub.getPropertyValue(labelProp)
        if (label == None):
            label = sub.getLocalName()
            sub.setPropertyValue(labelProp, label)
    
def processLine(line):        
    entries=line.split( ",")
    operation = entries[0]
    subclass = entries[1]
    superclass = entries[2]
    code = entries[7]
    synonym = entries[9]
    if (operation == "add"):
        superCls=createClassIfLabelNotThere(superclass, kb.createNewResourceName("MRSA"), None, labelProp, metaCls, None)
        if (superCls == None):
            print(superclass + " is not a class")
        else:
            cls = createClassIfLabelNotThere(subclass, kb.createNewResourceName("MRSA"), superCls, labelProp, metaCls, None)
            annote=cls.getPropertyValue(termRefProp)
            if ((code != None) and (annote == None)):
                annote = termRefCls.createInstance(kb.createNewResourceName("Snomed"+ code))
                annote.setPropertyValue(termSysProp, snomedct)
                annote.setPropertyValue(codeProp, code)
                cls.setPropertyValue(termRefProp, annote)
    
def startMRSAImport(fileName):
    input = open(fileName, 'r')
    line = input.readline()
    line = input.readline()
    line = input.readline()
    try:       
        while line != "":
            processLine(line)
            line = input.readline()
    finally:
        input.close()