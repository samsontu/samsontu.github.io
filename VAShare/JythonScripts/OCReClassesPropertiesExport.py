# listingProperties(classes, kb, "C:/Dropbox/OCRe")

classes = ["http://purl.org/net/OCRe/OCRe.owl#OCRE400029", "http://purl.org/net/OCRe/OCRe.owl#OCRE400076","http://purl.org/net/OCRe/OCRe.owl#OCRE400079",  "http://purl.org/net/OCRe/OCRe.owl#OCRE400040"]

rdfslabelprop = kb.getRDFSLabelProperty()
definitionprop = kb.getRDFProperty("http://purl.obolibrary.org/obo/IAO_0000115")

def listingProperties(classes, kb, outputDir):
    outputfile = outputDir + "/OCReProperties.txt"
    try:
        output = open(outputfile, 'w')  
        for c in classes:
            cls = kb.getOWLNamedClass(c)
            if (cls != None):
                properties = cls.getUnionDomainProperties(0)
                for p in properties:
                    if (cls.getPropertyValue(rdfslabelprop) != None):
                        print cls.getPropertyValue(rdfslabelprop)
                        output.write(cls.getPropertyValue(rdfslabelprop))
                    output.write("\t")
                    output.write(cls.getName() + "\t")
                    if (p.getPropertyValue(rdfslabelprop) != None):
                        print p.getPropertyValue(rdfslabelprop)
                        output.write(p.getPropertyValue(rdfslabelprop))
                    output.write("\t")
                    print p.getName()               
                    output.write(p.getName())
                    if (p.getPropertyValue(definitionprop) != None):
                        output.write("\t\"")
                        print p.getPropertyValue(definitionprop)+"\""
                        output.write(p.getPropertyValue(definitionprop))
                    output.write("\n")
    finally:
        output.close()
    
