## Classes

<dl>
<dt><a href="#Set">Set</a></dt>
<dd><p>Extended version of <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set">Set (MDN link)</a></p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#isProperSupersetOf">isProperSupersetOf(set)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#isProperSubsetOf">isProperSubsetOf(set)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#symmetricDifference">symmetricDifference(...args)</a> ⇒ <code>Set.&lt;any&gt;</code></dt>
<dd><p>Creates the symmetric difference of an arbitrary number (2 .. n) of sets.</p>
</dd>
<dt><a href="#mergeRules">mergeRules(...rules)</a> ⇒ <code>function</code></dt>
<dd></dd>
<dt><a href="#mergeRulesStrict">mergeRulesStrict(...rules)</a> ⇒ <code>function</code></dt>
<dd></dd>
</dl>

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
        * [.any()](#Set+any) ⇒ <code>T</code>
        * [.isSupersetOf(set)](#Set+isSupersetOf) ⇒ <code>boolean</code>
        * [.isSubsetOf(set)](#Set+isSubsetOf) ⇒ <code>boolean</code>
        * [.equal(set)](#Set+equal) ⇒ <code>boolean</code>
    * _static_
        * [.from(args)](#Set.from) ⇒ [<code>Set</code>](#Set)
        * [.toSet(value)](#Set.toSet) ⇒ [<code>Set</code>](#Set)
        * [.copy(set)](#Set.copy) ⇒ [<code>Set</code>](#Set)
        * [.union(...args)](#Set.union) ⇒ [<code>Set</code>](#Set)
        * [.intersect(...args)](#Set.intersect) ⇒ [<code>Set</code>](#Set)
        * [.complement(set1, set2)](#Set.complement) ⇒ <code>ExtendedSet</code> \| <code>\*</code>
        * [.cartesian(set1, set2)](#Set.cartesian)
        * [.power(S)](#Set.power) ⇒ <code>\*</code>

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

<a name="Set+rules"></a>

### set.rules(value) ⇒ <code>function</code> \| <code>undefined</code>
Pass a function that dictates the rules for elements to be part of this set.
Use without args to get the current rules function.

**Kind**: instance method of [<code>Set</code>](#Set)  
**Returns**: <code>function</code> \| <code>undefined</code> - Returns the current rules Function if called without args, else nothing.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>function</code> | (Optional) a Function that obtains a single argument and returns either a truthy or falsey value. |

<a name="Set+toArray"></a>

### set.toArray() ⇒ <code>Array</code>
Creates an unsorted array from all elements of this set.

**Kind**: instance method of [<code>Set</code>](#Set)  
**Returns**: <code>Array</code> - Array containing all elements of this set in unsorted order.  
**Example**  
```js
new Set([1, 2, 3, 4]).toArray() // [ 1, 2, 3, 4 ]
```
<a name="Set+any"></a>

### set.any() ⇒ <code>T</code>
Returns an arbitrary element of this collection.
Basically the first element, retrieved by iterator.next().value will be used.

**Kind**: instance method of [<code>Set</code>](#Set)  
**Returns**: <code>T</code> - An arbitrary element of the current set.  
<a name="Set+isSupersetOf"></a>

### set.isSupersetOf(set) ⇒ <code>boolean</code>
Checks, whether the current set (this) is a subset of the given set.

**Kind**: instance method of [<code>Set</code>](#Set)  
**Returns**: <code>boolean</code> - true if this set is the superset of the given set, otherwise false.  
**Throws**:

- Throws an error, if the given set is not a set instance.

**See**: https://en.wikipedia.org/wiki/Subset  

| Param | Type | Description |
| --- | --- | --- |
| set | [<code>Set</code>](#Set) | A set instance of which this set is checked to be the superset. |

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

<a name="Set+equal"></a>

### set.equal(set) ⇒ <code>boolean</code>
Checks, whether two sets are equal in terms of their contained elements.

**Kind**: instance method of [<code>Set</code>](#Set)  
**Returns**: <code>boolean</code> - true, if all elements of this set equal to the elements of the given set.  
**Throws**:

- Throws an error if the given paramter is not a Set instance.


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
<a name="Set.from"></a>

### Set.from(args) ⇒ [<code>Set</code>](#Set)
Creates a new Set from arbitrary arguments wihtout the need of "new" and the array notation.

**Kind**: static method of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - A set containing the given argument values.  

| Param | Description |
| --- | --- |
| args | Any types / length (using comma notation or spread operator) |

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
Creates a unified set of an arbitrary number of sets.
A union of A and B is a set containing all elements of A and B.
<br>Expression: <code>C = A ∪ B</code>
<br>Example: <code>{1,2} ∪ {2,3,4} = {1,2,3,4}</code>

**Kind**: static method of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - a Set instance with the unified elements of the given args.  
**Throws**:

- Throws an error if any of the argument is not a Set instance.


| Param | Type | Description |
| --- | --- | --- |
| ...args | [<code>Set</code>](#Set) | an arbitrary list of Set instances |

<a name="Set.intersect"></a>

### Set.intersect(...args) ⇒ [<code>Set</code>](#Set)
Creates an intersection set of an arbitrary number of sets.
An intersection is a set of A and B, which contains all elements that appear in A, as well as in B: <code>C = A ∩ B</code>
Example: <code>{1, 2, 3} ∩ {2, 3, 4} = {2, 3}.</code>

**Kind**: static method of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - a Set instance with the unified elements of the given args.  
**Throws**:

- Throws an error if any of the argument is not a Set instance.

**See**: https://en.wikipedia.org/wiki/Intersection_(set_theory)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | [<code>Set</code>](#Set) | an arbitrary list of Set instances |

<a name="Set.complement"></a>

### Set.complement(set1, set2) ⇒ <code>ExtendedSet</code> \| <code>\*</code>
Creates a complement of two sets (subtracts B from A): <code>C = A \ B</code>

**Kind**: static method of [<code>Set</code>](#Set)  
**Returns**: <code>ExtendedSet</code> \| <code>\*</code> - A new Set with all elements of A minus the elements of B  
**Throws**:

- Throws an error if any of the argument is not a Set instance.


| Param | Description |
| --- | --- |
| set1 | A the set to be subtracted from |
| set2 | B the set which elements will be subtracted from A |

<a name="Set.cartesian"></a>

### Set.cartesian(set1, set2)
**Kind**: static method of [<code>Set</code>](#Set)  

| Param |
| --- |
| set1 | 
| set2 | 

<a name="Set.power"></a>

### Set.power(S) ⇒ <code>\*</code>
Creates the powerset of a set.

**Kind**: static method of [<code>Set</code>](#Set)  

| Param |
| --- |
| S | 

<a name="isProperSupersetOf"></a>

## isProperSupersetOf(set) ⇒ <code>boolean</code>
**Kind**: global function  
**See**: https://en.wikipedia.org/wiki/Subset  

| Param |
| --- |
| set | 

<a name="isProperSubsetOf"></a>

## isProperSubsetOf(set) ⇒ <code>boolean</code>
**Kind**: global function  
**See**: https://en.wikipedia.org/wiki/Subset  

| Param | Type | Description |
| --- | --- | --- |
| set | [<code>Set</code>](#Set) | A set instance of which this set is checked to be the proper subset. |

<a name="symmetricDifference"></a>

## symmetricDifference(...args) ⇒ <code>Set.&lt;any&gt;</code>
Creates the symmetric difference of an arbitrary number (2 .. n) of sets.

**Kind**: global function  

| Param |
| --- |
| ...args | 

<a name="mergeRules"></a>

## mergeRules(...rules) ⇒ <code>function</code>
**Kind**: global function  

| Param |
| --- |
| ...rules | 

<a name="mergeRulesStrict"></a>

## mergeRulesStrict(...rules) ⇒ <code>function</code>
**Kind**: global function  

| Param |
| --- |
| ...rules | 

