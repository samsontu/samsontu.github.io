
topMeta = kb.getCls("Medical_Conditions_Metaclass")
prettyNameSlot = kb.getSlot("PrettyName")
dx = ['Hypertension', 'DM-Type2', 'Heart_Failure', 'Myocardial_Infarction', 'Chronic_Kidney_Disease', 'Tobacco_Use']
	
def findNonICDMedicalCondition(output):
	clses = topMeta.getInstances()
	for cls in clses:
		if (isLeafClass(cls) and isNonICD(cls)):
			output.write(cls.getName() +"\n")
			
def isLeafClass(cls):
	subs = cls.getSubclasses()
	subList= []
	for sub in subs:
		subList.append(sub)
	return (subList == [])
	
	
def isNonICD(cls):
	clsName=cls.getName()
	return not(clsName[1].isdigit())
	
def isICD(cls):
	clsName=cls.getName()
	return (clsName[1].isdigit())

def findICDMedicalCondition(output):
	clses = topMeta.getInstances()
	for cls in clses:
		if ((not isLeafClass(cls)) and isNonICD(cls)):
			subClasses = cls.getDirectSubclasses()
			prettyName = cls.getOwnSlotValue(prettyNameSlot)
			if (not prettyName):
				prettyName=""
			ICDs = []
			for sub in subClasses:
				if isICD(sub):
					ICDs.append(sub)
			if (len(ICDs) > 0):
				for icd in ICDs:
					output.write(cls.getName() + "\t"+ icd.getName()+ "\t"+ prettyName +"\n")

def getDxICDs(output):
    for condition in dx:
        cls = kb.getCls(condition)
        if cls:
            prettyName = cls.getOwnSlotValue(prettyNameSlot)
            if (not prettyName):
                prettyName=""            
            subs = cls.getSubclasses()
            ICDs = []
            for sub in subs:
                if (isICD(sub)):
                    ICDs.append(sub)
            if (len(ICDs)>0):
                for icd in ICDs:
                    output.write(cls.getName() + "\t"+ icd.getName()+ "\t"+ prettyName +"\n")

                
