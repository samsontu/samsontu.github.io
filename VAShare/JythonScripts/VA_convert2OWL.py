
_labelProperty = kb.getRDFSLabelProperty()
_commentProperty=kb.getRDFSCommentProperty()
_topClass = kb.getOWLNamedClass('MRSA_ontology_concept')
_ownLabelProperty=kb.getOWLDatatypeProperty("label")
_ownTermProperty=kb.getRDFProperty("has_terminology_reference")
_ownLitProperty=kb.getRDFProperty("has_literature_reference")
_ownAnnoTermProperty=kb.getOWLObjectProperty("terminology_reference")
_ownAnnoLitProperty=kb.getOWLObjectProperty("literature_reference")
_ownDefProperty=kb.getOWLDatatypeProperty("definition")
_ownAnnoDefProperty=kb.getRDFProperty("has_definition")
_hasSampleProperty=kb.getOWLObjectProperty("has_sample")

def deleteUnreferenced():
    cls = kb.getCls("Timestamp")
    if (cls != None):
        ins = cls.getInstances()
        for inst in ins:
            refs = inst.getReferences()
            if (refs != None):
                if (refs.size()== 1):
                    kb.deleteInstance(inst)

def fixAnnotations():
    classes = _topClass.getSubclasses()
    for cls in classes:
#        term = cls.getOwnSlotValue(_ownTermProperty)
#        if (term != None):
#            cls.setOwnSlotValue(_ownAnnoTermProperty, term)
        lit = cls.getOwnSlotValue(_ownLitProperty)
        if (lit != None):
            cls.setOwnSlotValue(_ownAnnoLitProperty, lit)

def setSample():
    classes = _topClass.getSubclasses()
    for cls in classes:
        sample = cls.getOwnSlotValue(_hasSampleProperty)
        if (sample != None):
            insertSomeRelation(cls, sample, _hasSampleProperty)
            
def insertSomeRelation(cls1, cls2, relProp):
    if (cls1 and cls2):
        if (not (hasSomeRestriction(cls1, relProp, cls2))):
            someR =kb.createOWLSomeValuesFrom(relProp, cls2)
            cls1.addSuperclass(someR)
    else:
        msg="%s and/or %s have not been created as classes" % (cls1, cls2)
        if log:
            log.write(msg)
        else:
            print msg

def hasSomeRestriction(cls, property, filler):
  restrictions = cls.getRestrictions(property, 1)
  hasRestriction = 0
  for r in restrictions:
      if (str(r.getClass()) == "edu.stanford.smi.protegex.owl.model.impl.DefaultOWLSomeValuesFrom"):
          if (r.getSomeValuesFrom() == filler):
              hasRestriction = 1
  return hasRestriction


def setDefinition():
    classes = _topClass.getSubclasses()
    for cls in classes:
        lits = cls.getOwnSlotValue(_ownDefProperty)
        if (lits != None):
            cls.setOwnSlotValue(_ownAnnoDefProperty, lits)


def setLabel():
	classes = _topClass.getSubclasses()
	for cls in classes:
		label = cls.getOwnSlotValue(_ownLabelProperty)
		if (label != None):
			oldLabel=cls.getOwnSlotValue(_labelProperty)
			if (oldLabel != None):
				 cls.removeOwnSlotValue(_labelProperty, oldLabel)
			cls.setOwnSlotValue(_labelProperty, label)
			
def setLiteratureRef():
    classes = _topClass.getSubclasses()
    for cls in classes:
        lits = cls.getOwnSlotValues(_ownLitProperty)
        if (lits != None):
            for lit in lits:
                cls.addOwnSlotValue(_ownAnnoLitProperty, lit)

def setTermRef():
    classes = _topClass.getSubclasses()
    for cls in classes:
        lits = cls.getOwnSlotValues(_ownTermProperty)
        if (lits != None):
            for lit in lits:
                cls.addOwnSlotValue(_ownAnnoTermProperty, lit)


def setCriteria():
    classes = _topClass.getSubclasses()
    for cls in classes:
        lits = cls.getOwnSlotValue(_ownDefProperty)
        if (lits != None):
            cls.setOwnSlotValue(_ownAnnoDefProperty, lits)
