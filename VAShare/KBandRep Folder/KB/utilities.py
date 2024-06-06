
definedMeta = kb.getCls("Diagnostic_Term_Metaclass")
derivedMeta = kb.getCla("Derived_Parameter_Metaclass")
notPrimitive = [definedMeta, derivedMeta]
dataSourceSlot = kb.getSlot("data_source")

def addDefaultSource():
    topClasses = ["Patient_Observations", "Patient_History_Class", "Medical_Conditions_Class", "Diagnostic_Procedures_Class"]
    for clas in topClasses:
        cls = kb.getCls(clas)
        subs = cls.getSubclasses(1)
        for sub in subs:
            if (sub.isIncluded()):
                metas= sub.getTypes()
                if (() and(metas.intersect(notPrimitive) == None)):
                    sub.setOwnSlotValue(dataSourceSlot, "VISTA_data_element")

                    
