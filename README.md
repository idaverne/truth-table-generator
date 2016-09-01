# truth-table-generator

To view the generator in all its glory, visit http://www.idavernestanfield.com/multivalued-truth-table-generator/

***Safari users*** The app is posted to idavernestanfield.com as an iFrame. Due to compatibility issues, Safari users may be unable to use the app. Please view in Chrome v.52+ or Firefox v.48+.

This truth-table generator allows you to compare how Classical, Lukasiewicz, Gödel, and Kleene logics compute propositional formulas. Simply enter a formula, choose a logic and view the resulting table. Some notes on form: 

Any letter on the keyboard, excepting 'v' can be used as a variable. 'V' is reserved as the symbol for disjunction. 

Keyboard symbols for operators:
v  :  Disjunction/Or/⋁                   &  :  Conjunction/and/⋀
>  :  Conditional/If-then/ →         %  :  Bi-conditional/if-and-only-if/↔
~  :  Negation/Not/¬

Every formula and sub-formula must be bracketed by parentheses, such that there are twice as many parentheses as binary operators.  'v' , '>' , '&' , '%' are binary operators. '~' is a unary operator, so the parentheses rule does not apply to it. I.e. ( F v B)  ;  ((D & ~ D) % ~(C v C))  ; but NOT! ((F v B)) ; and NOT ! (~C)

Any symbol that is not a letter, a parentheses or an operator is disallowed. I.e. [~9 # p] is not a well-formed formula.

Example well-formed formulas:
'Jane will go to the circus, if and only if Marcus or Logan is on stage' becomes:
(J % (M v L))

'Luba loves ice cream when it is sunny, but not when it is gray out' becomes: 
((S > L) & (~S >~L))
