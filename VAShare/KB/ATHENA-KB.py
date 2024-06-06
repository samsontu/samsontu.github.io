# This is a set of scripts that refactor the ATHENA KB

def listUnusedLeafClasses(top):
	#Leaf node + no frame reference node through user-defined slot
	unreferencedLeaves = []
	topCls=kb.getCls(top)
	if topCls:
		subclasses = topCls.getSubclasses()
		leafClasses= []
		for sub in subclasses:
			if (sub.getSubclasses == None):
				leafClasses = leafClasses.append(sub)
		print leafClasses
		for leaf in leafClasses:
			refs = leaf.getReferences()
			referenced = 0
			for ref in refs:
				slot = ref.getSlot()
				if (slot.isSystem() == 0):
					referenced = 1
			if (referenced == 0):
				unreferencedLeaves = unreferencedLeaves.append(leaf)
	return unreferencedLeaves


def generateSupportInstances():
	compIndSlot = kb.getSlot("Compelling_Indications")
	relIndSlot = kb.getSlot("Relative_Indications")
	diCls = kb.getCls("Drug_Indication_Relation")
	crelCls = kb.getCls("Drug_Indication_Relation")
	degreeSlot = kb.getSlot("degree")
	drugSlot = kb.getSlot("Drug")
	indSlot = kb.getSlot("indication")
	labelSlot = kb.getSlot("label")
	drugClassNameSlot=kb.getSlot("Drug_Class_Name")
	drugUsages = kb.getCls("Drug_Usage").getInstances()
	for d in drugUsages:
		compelind = d.getOwnSlotValues(compIndSlot)
		relind = d.getOwnSlotValues(relIndSlot)
		if (compelind != None):
			for ci in compelind:
				di = diCls.createDirectInstance("CompellingInd"+ci.getName()+d.getBrowserText())
				di.setOwnSlotValue(degreeSlot, "compelling")
				di.setOwnSlotValue(drugSlot, d.getOwnSlotValue(drugClassNameSlot))
				di.setOwnSlotValue(indSlot, ci)
		if (relind != None):
			for ci in relind:
				di = diCls.createDirectInstance("RelativeInd"+ci.getName()+ d.getBrowserText())
				di.setOwnSlotValue(degreeSlot, "relative")
				di.setOwnSlotValue(drugSlot, d.getOwnSlotValue(drugClassNameSlot))
				di.setOwnSlotValue(indSlot, ci)
				



from edu.stanford.smi.protege.model import ValueType
instance = kb.getInstance("ATHENA_HF_Class70043")
from edu.stanford.smi.protege.model import SimpleInstance
from edu.stanford.smi.protege.model import DefaultCls
localCls = kb.getCls("LocalHFClass")
clsProps = [":DIRECT-TYPE", ":DIRECT-SUPERCLASSES", ":DIRECT-SUBCLASSES"]

def getLibClsReferences(inst, libCls, seen):
	slots = inst.getOwnSlots()
	print "Entering..."+inst.getBrowserText()
	seen.append(inst)
	for slot in slots:
		#print "Slot: "+slot.getBrowserText()
		if (not (slot.getName() in clsProps)):
			values = inst.getOwnSlotValues(slot)
			if ((slot.getValueType() == ValueType.valueOf("Class")) or (slot.getValueType() == ValueType.valueOf("String"))):
				for v in values:
					if (isinstance(v, DefaultCls)):
						if (not (v.isSystem())):
							if ((v.isIncluded() ) and (not (v in libCls))):
								#print v
								libCls.append(v)
								if (not (v in seen)):
									libCls = getLibClsReferences(v, libCls, seen)
					#else:
						#print v
			if (slot.getValueType() == ValueType.valueOf("Instance")):
				for v in values:
					#print v
					if (isinstance(v, SimpleInstance)):
						#print v
						if (not (v in seen)):
							libCls = getLibClsReferences(v, libCls, seen) 
	return libCls


def setLocalClsReferences(inst, seen):
	slots = inst.getOwnSlots()
	print "Entering..."+inst.getBrowserText()
	seen.append(inst)
	for slot in slots:
		#print "Slot: "+slot.getBrowserText()
		if (not (slot.getName() in clsProps)):
			values = inst.getOwnSlotValues(slot)
			if ((slot.getValueType() == ValueType.valueOf("Class")) or (slot.getValueType() == ValueType.valueOf("String"))):
				for v in values:
					if (isinstance(v, DefaultCls)):
						#print v
						if (not (v.isSystem())):
							supers = v.getDirectSuperclasses()
							if ((not (v.isIncluded() )) and (not (localCls in supers))):
								#print v
								v.addDirectSuperclass(localCls)
								if (not (v in seen)):
									setLocalClsReferences(v, seen)
					#else:
						#print v
			if (slot.getValueType() == ValueType.valueOf("Instance")):
				for v in values:
					#print v
					if (isinstance(v, SimpleInstance)):
						#print v
						if (not (v in seen)):
							setLocalClsReferences(v, seen) 
						
		
hfclass = kb.getCls("HFClass")
for c in libClasses:
	cls = kb.getCls(c)
	if cls:
		if (not (cls.isIncluded())):
			cls.addDirectSuperclass(hfclass)
		else:
			print "not in lib "+c
	else:
		print "Not cls " +c
		
slot = kb.getSlot("data_source")
subs = hfclass.getDirectSubclasses()
for s in subs:
	s.setOwnSlotValue(slot, 'VISTA_data_element')

