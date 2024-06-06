
;********
; Code for transforming clips instances into glif format
;      and for deleting bogus instances
; 
; Input: a file of instances generate by the KA tool
; Output: a file of instances in glif format
; Usage: (clips2glif clips-inputfile glif-outputfile classfile toplevel-class inlinep )
; Assumptions: (1) All classes have names of the form "Xxx_Yyy"
;              (2) All attributes and symbols are in lower case
;
;; inlinep is true if instances are to be embedded in their part-of parent, not implemented yet

;;;****************************  Auxiliary Functions *********************************

(defvar *class-multislots* nil)
(defvar *completed-instances* nil)
(defvar *inline-classes* '(Physician Boolean_Criterion And_Criterion Or_Criterion 
				  Patient_Data Presence_Criterion Simple_Criterion 
				  Definite_Duration Definite_Time ))

;Collect the multislots class definitions
(defmacro defclass (class-name &rest classdef)
  ;loads clips class
  `(setq *class-multislots* (cons (cons (quote , class-name)  (collect-multislots (quote , classdef)))
                                  *class-multislots*)))
; Functin to collect multislots
(defun collect-multislots (slots)
 (let (multislots)
   (dolist (slot slots)
     (if (and (consp slot)(eq (car slot) 'multislot))
       (setq multislots (cons (cadr slot) multislots))))
   multislots))


;; ********************* Top-level Function **************************************

;; (clips2glif "HD-112:eon:BreastTreatment.pins" "HD-112:eon:BreastTreatment.glif"  
;;             "HD-112:eon:guideline.pont" 'Guidelines nil)

;; (clips2glif "HD-112:intermed:breastmass.pins" "HD-112:intermed:breastmass.glif"  
;;             "HD-112:intermed:guideline.pont" 'Guidelines nil)

(defun clips2glif (inputfile outputfile class-file toplevel &optional (inlinep t))
  "Toplevel function to delete bogus instances and to translate into glif."
  (declare (special *top-level-class* *instancesetname* ))
  ; Load the class definitions to get the multislot information
  (setq *class-multislots* nil)
  (load class-file)
  (setq *top-level-class* toplevel)
  (let (instancesetform instanceset instance end-of-file)
    (setq *instancesetname* inputfile)
    (with-open-file (inputstream inputfile :direction :input)
      (setq instancesetform (read inputstream nil))
      (setq instanceset (cons instancesetform instanceset))
      (setq instanceset 
                     (do nil (end-of-file (reverse instanceset))             
                       (setq instance (read inputstream nil))
                       (if instance (setq instanceset (cons instance instanceset))
                           (setq end-of-file T)))))
    
    (setq instanceset
          (destroy-unreferenced-instances instanceset))
    (translate-clips2glif instanceset outputfile inlinep 0)
    )
  nil)


;;;********************************* Access Functions ****************************************

(defun clips-class-name (instance)
  (caddr instance))

(defun instance-name (instance)
  (car instance))

(defun slots (instance)
  (cdddr instance))

(defun slots-names (instance)
  (mapcar #'car (slots instance)))

(defun clips-slot-value (instance slot)
  (cadr (assoc slot (slots instance)  )))

;;; *********************************Functions Dealing with Bogus Instances and Slots **************

(defun bogus-instancep (instance instanceset)
  "An instance is  bogus if (1) it has no slot (2) it has no slot value, and (2) if the non-empty
 slot has references to instances that are not in instanceset"
  (or (null (slots-names instance))
      (every #'(lambda (x) (null (clips-slot-value instance x))) 
             (slots-names instance))
      (every #'(lambda (x) (bogus-reference x instanceset))
             (non-empty-slot-values instance))))


(defun non-empty-slot-values (instance)
  (mapcan #'(lambda (x) (if (cdr x)(copy-list (cdr x))))
          (slots instance)))

(defun bogus-reference (ref instanceset)
  (and (is-clips-instancep ref)(not (assoc ref instanceset))))

(defun collect-instance-ref (instance)
  (mapcan #'(lambda (x) (let ((slot-value (cdr x)))
                          (if  (and slot-value (is-clips-instancep (car slot-value)))
                            (copy-list slot-value))))
          (slots instance)))


(defun destroy-unreferenced-instances (instanceset)
  "This function delete those instances not directly or indirectly referenced
   by the top-level-object"
  (declare (special *top-level-class*))
  (let ((marktable (create-mark-flag instanceset)))
    (mark *top-level-class* instanceset marktable )
    (delete-unmarked instanceset marktable)))

(defun create-mark-flag (instanceset)
  (let ((ht (make-hash-table :size 100 :rehash-size 1.4 )))
    (dolist (instance (mapcar #'instance-name instanceset) ht)
      (setf (gethash  instance ht) nil))))

(defun mark (class instanceset marktable)
  ; first find intances of this class, then mark the instances
  (let ((top-instances (instances-of class instanceset )))
    (mark-descendants top-instances instanceset marktable)))

(defun mark-descendants (instances instanceset marktable)
  (if instances 
    (dolist (instance instances)
      ;      (format t "~s~%" instance)
      (setf (gethash  (instance-name instance) marktable) t)
      (mark-descendants (collect-instances (collect-instance-ref instance)
                                           instanceset marktable)
                        instanceset
                        marktable))))

(defun collect-instances (refs instanceset marktable)
  "Given a set references to instances, return the unmarked instances"
  (mapcan #'(lambda (x) (if (and (member (instance-name x) refs)
                                 (not (gethash (instance-name x) marktable)))
                          (list x)))
          instanceset))

(defun delete-unmarked (instanceset marktable)
  "Delete those instances in instanceset that are not marked"
  (mapcan #'(lambda (x) (if (gethash  (instance-name x) marktable) (list x)))
          instanceset))

(defun instances-of (class instanceset)
  "Given a class name, return those instances of that class"
  (mapcan #'(lambda (x) (if (eq class (clips-class-name x))
                          (list x)))
          instanceset))

(defun retract-bogus-references (instanceset)
  "An interative algorithm for retracting bogus instances: Bogus-instancep
   detect bogus leaf nodes. After deleting them, work on the next set of 
   leaf nodes."
  (let (filtered-instances)
    (setq filtered-instances 
          (mapcan #'(lambda (x) (if (not (bogus-instancep x instanceset))
                                  (list x))) instanceset))    ; repeat until filtered-instances is the same as starting set
    ;    (format t "~s~%~%" filtered-instances)
    (do nil ((equal instanceset filtered-instances) filtered-instances)
      (setq instanceset filtered-instances)
      (setq filtered-instances 
            (mapcan #'(lambda (x) (if (not (bogus-instancep x instanceset))
                                    (list x)))
                    instanceset))
      ;      (format t "~s~%~%" filtered-instances)
      )))


;;****************

(defun translate-clips2glif (instanceset outputfile inlinep indent)
  (declare (special *completed-instances*))
  (setq *completed-instances* nil)
  (with-open-file (outputstream outputfile :direction :output :if-exists :supersede)
    (dolist (instance instanceset)
      (let (outputstring (outstream (make-string-output-stream)))
        (translate-instance instance instanceset inlinep indent outstream)
        (setq outputstring (get-output-stream-string outstream))
        (if outputstring 
          (format outputstream "~A~%~%" outputstring)))))
  )

(defun is-clips-instancep (arg)
 (if (not (stringp arg)) (setq arg (symbol-name arg)))
 (and (eq #\[ (elt arg 0))
      (eq #\]  (elt arg (- (length arg) 1)))
))

(defun print-instance (outstream instance string-name)
  (format outstream "(~A ~A);" 
          (string-capitalize (clips-class-name instance))
          (string-downcase (subseq string-name 1 (- (length string-name) 1)))))

(defun write-symbol (sym outstream instanceset inlinep indent)
  (declare (special *inline-classes*))
  (let ((string-name (symbol-name sym)))
    (if (is-clips-instancep string-name)
      (let ((instance (assoc sym instanceset)))
        (if (and inlinep (member (clips-class-name instance) *inline-classes*))
          (translate-instance instance instanceset inlinep (+ 1 indent) outstream)
          (print-instance outstream instance string-name)))
      (format outstream "~A;" (string-downcase string-name)))))
             
  

(defun write-entry (outstream entry instanceset inlinep indent)
  (if (stringp entry)
    (format  outstream "~s;" entry)
    (if (symbolp entry)
      (write-symbol entry outstream instanceset inlinep indent)
      (format outstream "~A;" entry ))))

(defun nextline (outstream n)
  (format outstream "~%")
  (dotimes (i n)
    (format outstream "       "))
)

(defun class-of-entry (entry instanceset)
  ;; entry should be an instance in instanceset
  (let ((instance (assoc entry instanceset)))
    (clips-class-name instance)))

(defun real-step-p (class-name slot  class-of-entry  inlinep indent)
  ;;******* Hack alert! ********
  ;; Because protege tool requires Guideline_Steps and Transitions be
  ;; in the steps (graph) attribute. This function filters Transitions
  ;; out of steps.
  (declare (special *inline-classes*))
  (and (not (and (eq class-name 'Guideline_Object)
                 (eq (car slot) 'steps)
                 (eq class-of-entry 'Transition)))
      ; (not (and (member class-name *inline-classes*)
      ;     inlinep (= indent 0)))
)
)

(defun translate-instance (instance instanceset inlinep indent outstream)
  ; Write out instance in GLIF format
  (declare (special *completed-instances*))
  (declare (special *inline-classes*))
  (if (not inlinep) (setq indent 0))
  (let ((class-name (clips-class-name instance))
        (instance-name (instance-name instance))
        (slots (slots instance))
        )
    (if (and (not (member instance *completed-instances*))
             (not (and inlinep (= indent 0)(member class-name *inline-classes*))))
      (progn (nextline outstream indent)
             (format outstream "~A ~A " 
                     (string-capitalize class-name)
                     (string-downcase 
                      (subseq (symbol-name instance-name) 1 
                              (- (length (symbol-name instance-name)) 1))))
             (nextline outstream indent)
             (format outstream "{")
             (nextline outstream indent)
             (dolist (slot slots)
               (if (not (equal (car slot) '__position))
                 (progn (format outstream "   ~A = " (string-downcase (symbol-name (car slot))))
                        (if (cardinality-multiplep class-name slot)
                          (progn (format outstream "SEQUENCE ~d {" (length (cdr slot)))
                                 (dolist (entry (cdr slot))
                                    (if (real-step-p class-name slot (class-of-entry entry instanceset) 
                                                      inlinep indent)
                                     (write-entry outstream entry instanceset inlinep indent))
                                   )
                                 (format outstream "};")
                                 (nextline outstream indent))
                          (progn (write-entry outstream (cadr slot) instanceset inlinep indent)
                                 ; (write-char #\; outstream)
                                 (nextline outstream indent))))))
             (format outstream "};")
             (setq *completed-instances* (cons instance *completed-instances*)))
      (if (and (member instance *completed-instances*) inlinep (> indent 0)
               (member class-name *inline-classes*))
        (print-instance outstream instance (symbol-name instance-name)))
      )))
      
(defun cardinality-multiplep (class-name slot)
  ; Determine if slot in class is a multislot
  (declare (special *CLASS-MULTISLOTS*))
  (member (car slot) (assoc class-name *CLASS-MULTISLOTS*)))


