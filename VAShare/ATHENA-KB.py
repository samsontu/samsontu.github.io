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
				
				
	