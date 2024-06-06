#! /usr/local/bin/perl
#
######################################################################
# I/O:
######################################################################

print "A Perl Script for getting the subclasses of a class\n";
print "(For use with lynx and ontologies loaded into the anonymous session\n";
print "of the ontolingua ontology editor.)\n\n";

print "Name of ontology:";
$kbName = <STDIN>;
chop($kbName);

print "Name of class:";
$className = <STDIN>;
chop($className);

######################################################################
# building the lynx -source string:
######################################################################

# Using the anonymous session....
#
$baseString = "http://www-ksl-svc.stanford.edu:5915/network-gfp&sid=anonymous";

# In the case of the subclass request, the second argument (#1) is the kb, and
# thus we need to do a "find-kb" on this.
#
$args = "&args-to-find-kb-on=(1)&args=(";

$colon = "%3A";
$cols = "%3A%3A";

$command = "gfp%3Aget-class-direct-subs-internal+";

# The class name gets an "ontolingua-user::" prepended to it:
#
$class = "ontolingua-user" . $cols . $className . "+";

$kbSearch = "(gfp%3A%3Afind-gfp-kb-of-type+(quote+%3Adefault)+";
$kbSearch = $kbSearch . "(quote+ontolingua-user" . $cols . $kbName . ")))";

$all = "-source \"" . $baseString . $args . $command . $class . $kbSearch . "\"";

######################################################################
# sending the lynx command:
######################################################################

print "sending lynx command ....\n\n";

$result = `lynx $all`;

printf "Raw result:\n%s\n", $result;

######################################################################
# parsing the result.
######################################################################

# We only care about the second line:
# (the 1st line seems to be always blank)
#
@lines = split(/\n/, $result);
$_ = $lines[1];

if (/^lynx/) { 
  die "LYNX error - who knows what happened...\n";
};


# Get rid of all parens, and NIL
#
s/\(//g;
s/\)//g;
s/NIL//g;

# Get rid of "ontolingua-user::" and the kbName, ignoring case.
#
s/ontolingua-user:://gi;
s/\@$kbName//gi;

printf "your result:\n(%s)\n\n", $_;
