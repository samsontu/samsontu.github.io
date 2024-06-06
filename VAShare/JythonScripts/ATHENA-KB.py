# This is a set of scripts that refactor the ATHENA KB

def listUnusedLeafClasses(top):
	#Leaf node + no frame reference node through user-defined slot
	unreferencedLeaves = []
	topCls = kb.getCls(top)
	if topCls:
		subclasses = topCls.getSubclasses()
		leafClasses = []
		for sub in subclasses:
			if (len(collection2List(sub.getSubclasses())) == 0):
				leafClasses.append(sub)
		print leafClasses
		for leaf in leafClasses:
			refs = leaf.getReferences()
			referenced = 0
			for ref in refs:
				slot = ref.getSlot()
				if (slot.isSystem() == 0):
					referenced = 1
			if (referenced == 0):
				unreferencedLeaves.append(leaf)
	return unreferencedLeaves

def getLeafClasses(topCls):
	leafClasses = []
	if topCls:
		if (len(collection2List(topCls.getSubclasses())) == 0):
			leafClasses.append(topCls)
		else:
			subclasses = topCls.getSubclasses()
			for sub in subclasses:
				if (len(collection2List(sub.getSubclasses())) == 0):
					leafClasses.append(sub)
	return leafClasses
	
def removeDuplicates(list):
	if (list == []):
		return []
	set = []
	for i in list:
		if (not i in set):
			if (set == []):
				set = [i]
			else:
				set.append(i)
	return set

def getReferencedLeafClassesOfRoots(rootCls, topCls):
	roots = rootCls.getInstances()
	set = []
	for root in roots:
		if (set == []):
			set = getReferencedLeafClasses(root, topCls)
		else:
			set.extend(getReferencedLeafClasses(root, topCls))
	return removeDuplicates(set)

def getReferencedLeafClasses(root, topCls):	
	clsReferences = getClsReferences(root, [], [], topCls)	
	leafCls = []	
	for cls in clsReferences:
		if (leafCls == []):
			leafCls= getLeafClasses(cls)
		else:
			leafCls.extend(getLeafClasses(cls))
	return removeDuplicates(leafCls)
	
def generateSupportInstances():
	compIndSlot = kb.getSlot("Compelling_Indications")
	relIndSlot = kb.getSlot("Relative_Indications")
	diCls = kb.getCls("Drug_Indication_Relation")
	crelCls = kb.getCls("Drug_Indication_Relation")
	degreeSlot = kb.getSlot("degree")
	drugSlot = kb.getSlot("Drug")
	indSlot = kb.getSlot("indication")
	labelSlot = kb.getSlot("label")
	drugClassNameSlot = kb.getSlot("Drug_Class_Name")
	drugUsages = kb.getCls("Drug_Usage").getInstances()
	for d in drugUsages:
		compelind = d.getOwnSlotValues(compIndSlot)
		relind = d.getOwnSlotValues(relIndSlot)
		if (compelind != None):
			for ci in compelind:
				di = diCls.createDirectInstance("CompellingInd" + ci.getName() + d.getBrowserText())
				di.setOwnSlotValue(degreeSlot, "compelling")
				di.setOwnSlotValue(drugSlot, d.getOwnSlotValue(drugClassNameSlot))
				di.setOwnSlotValue(indSlot, ci)
		if (relind != None):
			for ci in relind:
				di = diCls.createDirectInstance("RelativeInd" + ci.getName() + d.getBrowserText())
				di.setOwnSlotValue(degreeSlot, "relative")
				di.setOwnSlotValue(drugSlot, d.getOwnSlotValue(drugClassNameSlot))
				di.setOwnSlotValue(indSlot, ci)
				

topDomainCls = kb.getCls("Medications_Class")
instanceType = kb.getSlot("eligibility_criteria").getValueType()
clsType = kb.getSlot("encounter_type").getValueType()
domainTerm = kb.getSlot("domain_term")

def getClsReferences(inst, visited, allCls, topDomainCls):
	if (inst in visited):
		return allCls
	else:
		visited.append(inst)
	slots = inst.getOwnSlots()
	for slot in slots:
		if (not (slot.isSystem())):
			values = inst.getOwnSlotValues(slot)
			if (values != None):
				slotType = inst.getOwnSlotValueType(slot)
				if ((slot == domainTerm) or (slotType == clsType) or (slotType == instanceType)): #if v is instance or class, recurse
					for value in values:
						if (((slot == domainTerm) or (slotType == clsType)) and value.hasSuperclass(topDomainCls)): # if v is class and a subclass of Medical Domain Class
							if (not (value in allCls)):
								allCls.append(value)
						allCls = getClsReferences(value, visited, allCls, topDomainCls)
	return allCls

def getLocalDiagnosticClasses(allCls):
	diagCls = kb.getCls("Medical_Domain_Class")
	subs = collection2List(diagCls.getSubclasses())
	for s in subs:
		if ((not (s.isIncluded()))and (not (s in allCls))):
			allCls.append(s)
	return allCls
		
def collection2List(collection):
	l = []
	for i in collection:
		l.append(i)
	return l
	
def getLocalClsReferences(instName):
	localCls = []
	inst = kb.getInstance(instName)
	refs = inst.getReferences()
	for ref in refs:
		print ref
		frame = ref.getFrame()
		cls = kb.getCls(frame.getName())
		print cls
		if cls:
			if (not (cls.isSystem())):
				if (not (cls.isIncluded())):
					localCls.append(cls)
	return localCls


	
