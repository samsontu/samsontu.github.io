# -*- coding: utf-8 -*-
#================================================================================
#   Purpose:
#     Change MRSA class names to human-readable strings
#        
#        
#   Usage:
#        changeNames(namepairsFile)
#        
#   Example:
#       changeNames("http://www.va.gov/MRSA.owl#","/Users/tu/Dropbox/VA/CHIRMRSA/ontology/MRSAOntologyRenamingClasses.csv")
#       
#
#  
#  

def changeNames(namespace, namepairsFile):
    try:
        input=open(namepairsFile, 'r')
        namePairs = input.readlines()
        for pairedLine in namePairs:
            pair = pairedLine.strip().split(',')
            cls = kb.getOWLNamedClass(namespace + pair[1])
            if (cls and pair[0]):
                cls.rename(namespace+pair[0])
            else:
                print (pair[0] + " "+ pair[1]+" not valid")
    finally:
        input.close()
