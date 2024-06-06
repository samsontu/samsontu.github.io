_labelProperty = kb.getRDFSLabelProperty()
_commentProperty=kb.getRDFSCommentProperty()
_topClass = kb.getOWLNamedClass('MRSA_ontology_concept')
_ownLabelProperty=kb.getOWLDatatypeProperty("label")
_ownAnnoTermProperty=kb.getOWLObjectProperty("terminology_reference")
_ownAnnoLitProperty=kb.getOWLObjectProperty("literature_reference")
_hasSampleProperty=kb.getOWLObjectProperty("has_sample")

checkTermRefs("c:/CurrentWork/VA/CHIRMRSA/ontology/mrsa_ontology_termref.csv")
checkLitRefs("c:/CurrentWork/VA/CHIRMRSA/ontology/mrsa_ontology_litref.csv")

def checkTermRefs(file):
    fileobject = open(file)
    line=fileobject.readline()
    line=fileobject.readline()
    while line != "":
        checkTermRef(line)
        line=fileobject.readline()
    fileobject.close()


def checkLitRefs(file):
    fileobject = open(file)
    line=fileobject.readline()
    line=fileobject.readline()
    while line != "":
        checkLitRef(line)
        line=fileobject.readline()
    fileobject.close()

def checkTermRef(line):
    entries = split(line, "\t")
    className=entries[1]
    frameTermRefs=entries[2]
    cls=kb.getOWLNamedClass(className)
    if cls:
        termRefs = cls.getPropertyValues(_ownAnnoTermProperty)
        for ref in termRefs:
            print className +": "+ref.getBrowserText()+"\n"
        if (frameTermRefs and (not termRefs)):
            print className + frameTermRefs + "\n"

def checkLitRef(line):
    entries = split(line, "\t")
    className=entries[0]
    frameLitRefs=entries[1]
    cls=kb.getOWLNamedClass(className)
    if cls:
        litRefs = cls.getPropertyValues(_ownAnnoLitProperty)
        for ref in litRefs:
            print className +": "+ref.getBrowserText()+"\n"
        if (frameLitRefs and (not litRefs)):
            print className + frameLitRefs + "\n"
