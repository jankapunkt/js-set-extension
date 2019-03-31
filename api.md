<a name="Set"></a>

## Set
Extended version of <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set">Set (MDN link)</a>

**Kind**: global class  
**See**

- Set.from
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set


* [Set](#Set)
    * [new Set(elements, rulesFct)](#new_Set_new)
    * _instance_
        * [.add(value)](#Set+add) ⇒ [<code>Set</code>](#Set)
        * [.has(value)](#Set+has) ⇒ <code>boolean</code>
        * [.rules(value)](#Set+rules) ⇒ <code>function</code> \| <code>undefined</code>
        * [.toArray()](#Set+toArray) ⇒ <code>Array</code>
        * [.any()](#Set+any) ⇒ <code>\*</code>
        * [.isSupersetOf(set)](#Set+isSupersetOf) ⇒ <code>boolean</code>
        * [.isSubsetOf(set)](#Set+isSubsetOf) ⇒ <code>boolean</code>
        * [.properSupersetOf(set)](#Set+properSupersetOf) ⇒ <code>boolean</code>
        * [.properSupersetOf(set)](#Set+properSupersetOf) ⇒ <code>boolean</code>
        * [.equal(set)](#Set+equal) ⇒ <code>boolean</code>
        * [.union(args)](#Set+union) ⇒ [<code>Set</code>](#Set)
        * [.intersect(args)](#Set+intersect) ⇒ [<code>Set</code>](#Set)
        * [.minus(set)](#Set+minus) ⇒ <code>ExtendedSet</code> \| <code>\*</code>
    * _static_
        * [.from(...args)](#Set.from) ⇒ [<code>Set</code>](#Set)
        * [.toSet(value)](#Set.toSet) ⇒ [<code>Set</code>](#Set)
        * [.copy(set)](#Set.copy) ⇒ [<code>Set</code>](#Set)
        * [.union(...args)](#Set.union) ⇒ [<code>Set</code>](#Set)
        * [.intersection(...args)](#Set.intersection) ⇒ [<code>Set</code>](#Set)
        * [.difference(set1, set2)](#Set.difference) ⇒ <code>ExtendedSet</code> \| <code>\*</code>
        * [.complement(set1, set2)](#Set.complement) ⇒ <code>ExtendedSet</code> \| <code>\*</code>
        * [.symDiff(...args)](#Set.symDiff) ⇒ [<code>Set</code>](#Set)
        * [.cartesian(set1, set2)](#Set.cartesian) ⇒ [<code>Set</code>](#Set)
        * [.power(set)](#Set.power) ⇒ [<code>Set</code>](#Set)
        * [.mergeRules(...rules)](#Set.mergeRules) ⇒ <code>function</code>
        * [.mergeRulesStrict(...rules)](#Set.mergeRulesStrict) ⇒ <code>function</code>

<a name="new_Set_new"></a>

### new Set(elements, rulesFct)
Use <code>new Set(elements, rulesFct)</code> to create new sets. Alternatively you can use <code>Set.from</code>

**Returns**: [<code>Set</code>](#Set) - An instance of the extended version of <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set">Set (MDN link)</a>  

| Param | Type | Description |
| --- | --- | --- |
| elements | <code>array</code> | an Array of element. |
| rulesFct | <code>function</code> | a function which every element added to the set needs to pass. |

<a name="Set+add"></a>

### set.add(value) ⇒ [<code>Set</code>](#Set)
Adds a value to the set. If the set already contains the value, nothing happens.
Overrides Set.prototype.add.

**Kind**: instance method of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - the Set object  
**Throws**:

- <code>value</code> Error if rules function exists and  failed the rules check.

**See**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/add  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Required. Any arbitrary value to be added to the set. |

<a name="Set+has"></a>

### set.has(value) ⇒ <code>boolean</code>
Checks if the current set instance contains a given value by recursive deep compare.
Overrides the original Set.prototype.has.
The check is recursive and respects
<ul>
  <li>primitive types</li>
  <li>complex types, such as Objects or Arrays</li>
  <li>nested Objects and cyclic references</li>
  <li>functions</li>
  <li>functions with properties attached</li>
  <li>sets, sets of sets</li>
</ul>

Note, that functions will be checked against their whitespace-trimmed bodies, which can return false negatives,
if for example a comment is added to the compare function that not exists in the original function.

**Kind**: instance method of [<code>Set</code>](#Set)  
**Returns**: <code>boolean</code> - - True, if the value is contained by the set. False, if otherwise.  
**See**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to be checked. |

**Example**  
```js
const a = Set.from({ a:true, b:false })
a.has({ b:false, a:true })  // true
a.has({ b:false, a:false }) // false
```
<a name="Set+rules"></a>

### set.rules(value) ⇒ <code>function</code> \| <code>undefined</code>
Pass a function that dictates the rules for elements to be part of this set.
Use without args to get the current rules function.
<br>
A rules function needs to fulfill the following requirements:
<ul>
  <li>Obtain a single element as argument</li>
  <li>Check, if that element passes certain conditions</li>
  <li>Return false if the element fails any condition</li>
  <li>Otherwise return true</li>
</ul>
<br>
If a set contains a rules function (or a merge of many rules functions), the element will only be added to the set,
if it passes the rules check.

**Kind**: instance method of [<code>Set</code>](#Set)  
**Returns**: <code>function</code> \| <code>undefined</code> - Returns the current rules Function or undefined if there is on rules function assigned.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>function</code> | (Optional) a Function that obtains a single argument and returns either a truthy or falsey value. |

**Example**  
```js
const isInt = n => Number.isInteger(n)
const integers = Set.from()
integers.rules(isInt)
integers.add(1)   // OK, no error
integers.add(1.5) // throws error!
integers.add(1.0) // OK, because 1.0 === 1 in JS Number
```
<a name="Set+toArray"></a>

### set.toArray() ⇒ <code>Array</code>
Creates an (unsorted) array from all elements of this set.

**Kind**: instance method of [<code>Set</code>](#Set)  
**Returns**: <code>Array</code> - Array containing all elements of this set in unsorted order.  
**Example**  
```js
new Set([1, 2, 3, 4]).toArray() // [ 1, 2, 3, 4 ]
```
<a name="Set+any"></a>

### set.any() ⇒ <code>\*</code>
Returns an arbitrary element of this collection.
Basically the first element, retrieved by iterator.next().value will be used.

**Kind**: instance method of [<code>Set</code>](#Set)  
**Returns**: <code>\*</code> - An arbitrary element of the current set that could by of any type, depending on the elements of the set.  
<a name="Set+isSupersetOf"></a>

### set.isSupersetOf(set) ⇒ <code>boolean</code>
Checks, whether the current set (this) is a superset of the given set.
A set A is superset of set B, if A contains all elements of B.
<br>
Expression: <code>A ⊇ B</code>

**Kind**: instance method of [<code>Set</code>](#Set)  
**Returns**: <code>boolean</code> - true if this set is the superset of the given set, otherwise false.  
**Throws**:

- Throws an error, if the given set is not a set instance.

**See**: https://en.wikipedia.org/wiki/Subset  

| Param | Type | Description |
| --- | --- | --- |
| set | [<code>Set</code>](#Set) | A set instance of which this set is checked to be the superset. |

**Example**  
```js
const a = Set.from(1,2,3,4)
const b = Set.from(1,2,3)
const c = Set.from(1,2,3,4,5)
a.isSupersetOf(b) // true
a.isSupersetOf(c) // false
c.isSupersetOf(b) // true
```
<a name="Set+isSubsetOf"></a>

### set.isSubsetOf(set) ⇒ <code>boolean</code>
Checks, whether the current set (this) is a subset of the given set.
A set A is subset of set B, if B contains all elements of A.
<br>
Expression: <code>A ⊆ B</code>
<br>
If their sizes are also equal, they can be assumed as equal.
If their sizes are not equal, then A is called a proper subset of B.

**Kind**: instance method of [<code>Set</code>](#Set)  
**Returns**: <code>boolean</code> - - true if this set is the subset of the given set, false otherwise  
**Throws**:

- Throws an error, if the given set is not a set instance.

**See**

- https://en.wikipedia.org/wiki/Subset
- Set.prototype.equal
- Set.prototype.isProperSubsetOf


| Param | Type | Description |
| --- | --- | --- |
| set | [<code>Set</code>](#Set) | A set instance of which this set is checked to be the subset. |

**Example**  
```js
const a = Set.from(1,2,3,4)
const b = Set.from(1,2,3)
const c = Set.from(1,2,3,4,5)
a.isSubsetOf(b) // false
b.isSubsetOf(c) // true
c.isSubsetOf(a) // false
```
<a name="Set+properSupersetOf"></a>

### set.properSupersetOf(set) ⇒ <code>boolean</code>
Checks, whether the current set (this) is a proper superset of the given set.
A set A is a proper subset of set B, if A contains all elements of B and their sizes are not equal.
<br>
Expression: <code>A ⊃ B</code>

**Kind**: instance method of [<code>Set</code>](#Set)  
**See**: https://en.wikipedia.org/wiki/Subset  

| Param | Type | Description |
| --- | --- | --- |
| set | [<code>Set</code>](#Set) | A set instance of which this set is checked to be the proper superset. |

<a name="Set+properSupersetOf"></a>

### set.properSupersetOf(set) ⇒ <code>boolean</code>
Checks, whether the current set (this) is a proper subset of the given set.
A set A is a proper subset of set B, if B contains all elements of A and their sizes are not equal.
<br>
Expression: <code>A ⊂ B</code>

**Kind**: instance method of [<code>Set</code>](#Set)  
**See**: https://en.wikipedia.org/wiki/Subset  

| Param | Type | Description |
| --- | --- | --- |
| set | [<code>Set</code>](#Set) | A set instance of which this set is checked to be the proper subset. |

<a name="Set+equal"></a>

### set.equal(set) ⇒ <code>boolean</code>
Checks, whether two sets are equal in terms of their contained elements.
Note: This implementation uses a deep object comparison in order to check for "sameness".
This allows also to check equality for more complex / nested structures without the restriction of interpreting
"sameness" as "being the exact same instance". If such an equality is desired, please use Set.prototype.equalSrict

**Kind**: instance method of [<code>Set</code>](#Set)  
**Returns**: <code>boolean</code> - true, if all elements of this set equal to the elements of the given set.  
**Throws**:

- Throws an error if the given paramter is not a Set instance.

**See**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness
- Set.prototype.isSubsetOf


| Param | Type | Description |
| --- | --- | --- |
| set | [<code>Set</code>](#Set) | A set instance, which this set is to be compared with. |

**Example**  
```js
const a = Set.from(1,2,3)
const b = Set.from(1,2,3.0) // note that 3.0 will evaluate to 3 here!
a === b    // false
a.equal(b) // true
```
**Example**  
```js
const a = Set.from({ a:true, b:false })
const b = Set.from({ b:false, a:true })
a.equal(b) // true
```
<a name="Set+union"></a>

### set.union(args) ⇒ [<code>Set</code>](#Set)
Creates the set union of two sets.
The union of A and B is the set C that consists of all elements of A and B.
<br>Expression: <code>A ∪ B = C</code>
<br>Example: <code>{1,2} ∪ {1,7,8,9} = {1,2,7,8,9}</code>

**Kind**: instance method of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - a Set instance with the unified elements of the given args.  
**Throws**:

- Throws an error if there is not exactly one argument.
- Throws an error if the argument is not a Set instance.

**See**: https://en.wikipedia.org/wiki/Union_(set_theory)#Union_of_two_sets  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>set</code> | the other set to union with. |

**Example**  
```js
const A = Set.from(1, 2)
const B = Set.from(1, 7, 8, 9)
A.union(B) // Set { 1, 2, 7, 8, 9 }
```
<a name="Set+intersect"></a>

### set.intersect(args) ⇒ [<code>Set</code>](#Set)
Creates the set intersection of two sets.
The intersection S of sets A and B is the set whose elements consist of the elements that occur in both A and B.
<br>Expression: <code>A ∩ B = S</code>
<br>Example: <code>{0,1,2,4} ∩ {1,2,9} = {1,2}</code>

**Kind**: instance method of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - a Set instance with the shared elements of this set and the other set.  
**Throws**:

- Throws an error if there is not exactly one argument.
- Throws an error if the argument is not a Set instance.

**See**: https://en.wikipedia.org/wiki/Intersection_(set_theory)#Definition  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>set</code> | the other set to intersect with. |

**Example**  
```js
const A = Set.from(0, 1, 2, 4)
const B = Set.from(1, 2, 9)
A.intersect(B) // Set { 1, 2 }
```
<a name="Set+minus"></a>

### set.minus(set) ⇒ <code>ExtendedSet</code> \| <code>\*</code>
Computes the set difference of two sets (subtracts B from A). This is also known as the "relative complement".
<br>Expression: <code>A \ B = S</code>
<br>Example: <code>{1,2,3} \ {1,3,5} = {2}</code>

**Kind**: instance method of [<code>Set</code>](#Set)  
**Returns**: <code>ExtendedSet</code> \| <code>\*</code> - A new Set with all elements of this set minus the elements of B  
**Throws**:

- Throws an error if there is not exactly one argument.
- Throws an error if the argument is not a Set instance.


| Param | Description |
| --- | --- |
| set | B the set whose elements will be subtracted from this. |

**Example**  
```js
const A = Set.from(1, 2, 3)
const B = Set.from(1, 3, 5)
A.minus(B) // Set { 2 }
```
<a name="Set.from"></a>

### Set.from(...args) ⇒ [<code>Set</code>](#Set)
Creates a new Set from arbitrary arguments without the need of "new" and the array notation.

**Kind**: static method of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - A set containing the given argument values.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | values of any types / length (using comma notation or spread operator) |

**Example**  
```js
Set.from(1,2,3,4,5) // returns Set { 1, 2, 3, 4, 5 }
```
**Example**  
```js
const ints = Set.from(1,2,3)
const flts = Set.from(4.5, 5.6, 6.7)
Set.from(ints, flts) // returns Set { Set {1, 2, 3}, Set { 4.5, 5.6, 6.7 } }
```
<a name="Set.toSet"></a>

### Set.toSet(value) ⇒ [<code>Set</code>](#Set)
Autowraps a value to a Set, unless it is already a Set.

**Kind**: static method of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - A Set containing the value or the value if it is already a Set.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Any arbitrary value |

<a name="Set.copy"></a>

### Set.copy(set) ⇒ [<code>Set</code>](#Set)
Copies all elements of a given Set instance into a new Set and returns it.
<strong>It does not deep-clone the elements of the set.</strong>

**Kind**: static method of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - a new Set instance containing all elements of the source.  
**Throws**:

- Throws an error if the argument is not a Set instance.


| Param | Type | Description |
| --- | --- | --- |
| set | [<code>Set</code>](#Set) | a set instance from which to copy from |

<a name="Set.union"></a>

### Set.union(...args) ⇒ [<code>Set</code>](#Set)
Creates the set union of an arbitrary number of sets.
The union S of any number of sets M<sub>i</sub> is the set that consists of all elements of each M<sub>i</sub>.
<br>Expression: <code>∪ M = S</code>
<br>Example: <code>∪ {M_1, M_2, M_3} = S</code>
<br>Example: <code>∪ {A, B, C} = S</code>
<br>Example: <code>∪ {{0,4}, {1}, {9}} = {0,1,4,9}</code>

**Kind**: static method of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - a Set instance with the unified elements of the given args.  
**Throws**:

- Throws an error if any of the arguments is not a Set instance.

**See**: https://en.wikipedia.org/wiki/Union_(set_theory)#Arbitrary_unions  

| Param | Type | Description |
| --- | --- | --- |
| ...args | [<code>Set</code>](#Set) | an arbitrary list of Set instances |

**Example**  
```js
const A = Set.from(0, 4)
const B = Set.from(1)
const C = Set.from(9)
Set.union(A, B, C) // Set { 0, 1, 4, 9 }
const M = [A, B, C]
Set.union(...M) // Set { 0, 1, 4, 9 }
```
<a name="Set.intersection"></a>

### Set.intersection(...args) ⇒ [<code>Set</code>](#Set)
Creates the set intersection of an arbitrary number of sets.
The intersection S of any number of sets M<sub>i</sub> is the set whose elements consist of the elements that occur in every single set M<sub>i</sub>.
<br>Expression: <code>∩ M = S</code>
<br>Example: <code>∩ {M_1, M_2, M_3} = S</code>
<br>Example: <code>∩ {A, B, C} = S</code>
<br>Example: <code>∩ {{0,1,2,4}, {1,2,9}, {0,1,2}} = {1,2}</code>

**Kind**: static method of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - a Set instance with the shared elements of the given args.  
**Throws**:

- Throws an error if any of the arguments is not a Set instance.

**See**: https://en.wikipedia.org/wiki/Intersection_(set_theory)#Arbitrary_intersections  

| Param | Type | Description |
| --- | --- | --- |
| ...args | [<code>Set</code>](#Set) | an arbitrary list of Set instances |

**Example**  
```js
const A = Set.from(0, 1, 2, 4)
const B = Set.from(1, 2, 9)
const C = Set.from(0, 1, 2)
Set.intersection(A, B, C) // Set { 1, 2 }
const M = [A, B, C]
Set.intersection(...M) // Set { 1, 2 }
```
<a name="Set.difference"></a>

### Set.difference(set1, set2) ⇒ <code>ExtendedSet</code> \| <code>\*</code>
Computes the set difference of two sets (subtracts B from A). This is also known as the "relative complement".
<br>Expression: <code>A \ B = S</code>
<br>Example: <code>{1,2,3} \ {1,3,5} = {2}</code>

**Kind**: static method of [<code>Set</code>](#Set)  
**Returns**: <code>ExtendedSet</code> \| <code>\*</code> - A new Set with all elements of A minus the elements of B  
**Throws**:

- Throws an error if any of the arguments is not a Set instance.


| Param | Description |
| --- | --- |
| set1 | A the set to be subtracted from |
| set2 | B the set whose elements will be subtracted from A |

**Example**  
```js
const A = Set.from(1, 2, 3)
const B = Set.from(1, 3, 5)
Set.difference(A, B) // Set { 2 }
```
<a name="Set.complement"></a>

### Set.complement(set1, set2) ⇒ <code>ExtendedSet</code> \| <code>\*</code>
Computes the complement of set B where U is the universe: <code>C = U \ B</code>.  This is also known as the "absolute complement".

**Kind**: static method of [<code>Set</code>](#Set)  
**Returns**: <code>ExtendedSet</code> \| <code>\*</code> - A new Set with all elements of U minus the elements of B  
**Throws**:

- Throws an error if any of the arguments is not a Set instance.
- Throws an error if any element in B does not occur in U.


| Param | Description |
| --- | --- |
| set1 | U the set to be subtracted from |
| set2 | B the set whose elements will be subtracted from A |

<a name="Set.symDiff"></a>

### Set.symDiff(...args) ⇒ [<code>Set</code>](#Set)
Creates the symmetric difference (disjunctive union) of an arbitrary number (2 .. n) of sets.
The symmetric difference of two sets A and B is a set, that contains only those elements,
which are in either of the sets and not in their intersection.
The symmetric difference is commutative and associative, which is why arbitrary number of sets can be used as input
for a sequencial-computed symmetric difference.
<br>
Expression: <code>C = A Δ B</code>

**Kind**: static method of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - Returns a new Set, that contains only elements.  
**Throws**:

- Throws an error if any of the given arguments is not a set instance.

**See**: https://en.wikipedia.org/wiki/Symmetric_difference  

| Param | Type | Description |
| --- | --- | --- |
| ...args | [<code>Set</code>](#Set) | An arbitrary amount of Set instances |

**Example**  
```js
const a = Set.from(1,2,3)
const b = Set.from(3,4)
Set.symDiff(a, b) // Set { 1, 2, 4 }
```
<a name="Set.cartesian"></a>

### Set.cartesian(set1, set2) ⇒ [<code>Set</code>](#Set)
Creates the cartesian product of two given sets.
The cartesian product of two sets A and B is the set of all ordered pairs (a, b) where a ∈ A and b ∈ B.
<br>
Expression: <code>C = A x B = { (a, b) | a ∈ A and b ∈ B}</code>
<br>
Note, that <code>A x B ≠ B x A</code> (not commutative)

**Kind**: static method of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - a new set instance, that contains the ordered element pairs.  
**Throws**:

- Throws an error unless both arguments are set instances.

**See**: https://en.wikipedia.org/wiki/Cartesian_product  

| Param | Type | Description |
| --- | --- | --- |
| set1 | [<code>Set</code>](#Set) | A set instance |
| set2 | [<code>Set</code>](#Set) | A set instance |

**Example**  
```js
const a = Set.from(1,2)
const b = Set.from(3,4)
Set.cartesian(a, b) // Set { [1, 3], [1, 4], [2, 3], [2, 4] }
Set.cartesian(b, a) // Set { [3, 1], [3, 2], [4, 1], [4, 2] }
```
<a name="Set.power"></a>

### Set.power(set) ⇒ [<code>Set</code>](#Set)
Creates the powerset of a given set instance by using a recursive algorithm (see <a href="https://en.wikipedia.org/wiki/Power_set">Wikipedia</a>, section Algorithms).
The powerset of a set contains all possible subsets of the set, plus itself and the empty set.
<br>
<strong>Attention:</strong> This method grows exponentially with the size of the given set.

**Kind**: static method of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - a new set instance with all subsets of the given set, plus the given set itself and the empty set.  
**Throws**:

- Throws an error if the given set is not a set instance.

**See**: https://en.wikipedia.org/wiki/Power_set  

| Param | Type | Description |
| --- | --- | --- |
| set | [<code>Set</code>](#Set) | A Set instance. |

<a name="Set.mergeRules"></a>

### Set.mergeRules(...rules) ⇒ <code>function</code>
Merges two rules functions with a strict pass concept.
The resulting function requires the given element to pass at least one of the given functions (logical OR).

**Kind**: static method of [<code>Set</code>](#Set)  
**Returns**: <code>function</code> - The resulting rules function that can be attached to a set instance.  
**Throws**:

- Throws an error if any of the given parameters is not a Function

**See**: Set.prototype.rules  

| Param | Type | Description |
| --- | --- | --- |
| ...rules | <code>function</code> | An arbitrary amount of (rules-) functions. See [Set.prototype.rules](Set.prototype.rules) for requirements of a rules function. |

<a name="Set.mergeRulesStrict"></a>

### Set.mergeRulesStrict(...rules) ⇒ <code>function</code>
Merges two rules functions with a strict pass concept.
The resulting function requires the given element to pass all of the given functions (logical AND).
Thus, if the element fails one, it fails all.
<strong>Attention:</strong> If passed rules are mutually exclusive, none given element will pass the test in any circumstance.

**Kind**: static method of [<code>Set</code>](#Set)  
**Returns**: <code>function</code> - The resulting rules function that can be attached to a set instance.  
**Throws**:

- Throws an error if any of the given parameters is not a Function

**See**: Set.prototype.rules  

| Param | Type | Description |
| --- | --- | --- |
| ...rules | <code>function</code> | An arbitrary amount of (rules-) functions. See [Set.prototype.rules](Set.prototype.rules) for requirements of a rules function. |

