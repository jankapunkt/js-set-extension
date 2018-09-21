## Classes

<dl>
<dt><a href="#Set">Set</a></dt>
<dd><p>Extended version of <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set">Set (MDN link)</a></p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#rules">rules(value)</a> ⇒ <code>function</code> | <code>*</code></dt>
<dd><p>Pass a function that dictates the rules for elements to be part of this set.
Use without args to get the current rules function.</p>
</dd>
<dt><a href="#toArray">toArray()</a> ⇒ <code>Array</code></dt>
<dd><p>Creates an array from all elements of this set in unsorted order.</p>
</dd>
<dt><a href="#each">each(fct)</a></dt>
<dd><p>Executes a function on each element of the set.
The argument, that is passed is the current value of the iterator.</p>
</dd>
<dt><a href="#any">any()</a> ⇒ <code>T</code></dt>
<dd><p>Returns an arbitrary element of this collection.
Basically the first element, retrieved by iterator.next().value will be used.</p>
</dd>
<dt><a href="#isSupersetOf">isSupersetOf(set)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#isSubsetOf">isSubsetOf(set)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#isProperSupersetOf">isProperSupersetOf(set)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#isProperSubsetOf">isProperSubsetOf(set)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#equal">equal(set)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks, whether two sets are equal in terms of their contained elements.
Use the strict equals operator to determine, if they are equal in term of instances.</p>
</dd>
<dt><a href="#toSet">toSet(value)</a> ⇒ <code><a href="#Set">Set</a></code></dt>
<dd><p>Autowraps a value to a Set, unless it is already a Set.</p>
</dd>
<dt><a href="#symmetricDifference">symmetricDifference(...args)</a> ⇒ <code><a href="#any">Set.&lt;any&gt;</a></code></dt>
<dd><p>Creates the symmetric difference of an arbitrary number (2 .. n) of sets.</p>
</dd>
<dt><a href="#powerSet">powerSet(S)</a> ⇒ <code>*</code></dt>
<dd><p>Creates the powerset of a set.</p>
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
        * [.add](#Set+add) ⇒ <code>\*</code>
    * _static_
        * [.from](#Set.from) ⇒ [<code>Set</code>](#Set)
        * [.copy](#Set.copy) ⇒ [<code>Set</code>](#Set)
        * [.union](#Set.union) ⇒ [<code>Set</code>](#Set)
        * [.intersect](#Set.intersect) ⇒ [<code>Set</code>](#Set)
        * [.complement](#Set.complement) ⇒ <code>ExtendedSet</code> \| <code>\*</code>

<a name="new_Set_new"></a>

### new Set(elements, rulesFct)
Use <code>new Set(elements, rulesFct)</code> to create new sets. Alternatively you can use <code>Set.from</code>

**Returns**: [<code>Set</code>](#Set) - An instance of the extended version of <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set">Set (MDN link)</a>  

| Param | Type | Description |
| --- | --- | --- |
| elements | <code>array</code> | an Array of element. |
| rulesFct | <code>function</code> | a function which every element added to the set needs to pass. |

<a name="Set+add"></a>

### set.add ⇒ <code>\*</code>
Overrides Set.prototype.add to respect the internal rules function.

**Kind**: instance property of [<code>Set</code>](#Set)  
**Throws**:

- <code>value</code> Error if rules function exists and  failed the rules check.


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | any arbitrary value. |

<a name="Set.from"></a>

### Set.from ⇒ [<code>Set</code>](#Set)
Creates a new Set from arbitrary arguments wihtout the need of "new" and the array notation.

**Kind**: static property of [<code>Set</code>](#Set)  
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
<a name="Set.copy"></a>

### Set.copy ⇒ [<code>Set</code>](#Set)
Copies all elements of a given Set instance into a new Set and returns it.
<strong>It does not deep-clone the elements of the set.</strong>

**Kind**: static property of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - a new Set instance containing all elements of the source.  
**Throws**:

- Throws an error if the argument is not a Set instance.


| Param | Type | Description |
| --- | --- | --- |
| set | [<code>Set</code>](#Set) | a set instance from which to copy from |

<a name="Set.union"></a>

### Set.union ⇒ [<code>Set</code>](#Set)
Creates a unified set of an arbitrary number of sets.
A union of A and B is a set containing all elements of A and B.
<br>Expression: <code>C = A ∪ B</code>
<br>Example: <code>{1,2} ∪ {2,3,4} = {1,2,3,4}</code>

**Kind**: static property of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - a Set instance with the unified elements of the given args.  
**Throws**:

- Throws an error if any of the argument is not a Set instance.


| Param | Type | Description |
| --- | --- | --- |
| ...args | [<code>Set</code>](#Set) | an arbitrary list of Set instances |

<a name="Set.intersect"></a>

### Set.intersect ⇒ [<code>Set</code>](#Set)
Creates an intersection set of an arbitrary number of sets.
An intersection is a set of A and B, which contains all elements that appear in A, as well as in B: <code>C = A ∩ B</code>
Example: <code>{1, 2, 3} ∩ {2, 3, 4} = {2, 3}.</code>

**Kind**: static property of [<code>Set</code>](#Set)  
**Returns**: [<code>Set</code>](#Set) - a Set instance with the unified elements of the given args.  
**Throws**:

- Throws an error if any of the argument is not a Set instance.

**See**: https://en.wikipedia.org/wiki/Intersection_(set_theory)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | [<code>Set</code>](#Set) | an arbitrary list of Set instances |

<a name="Set.complement"></a>

### Set.complement ⇒ <code>ExtendedSet</code> \| <code>\*</code>
Creates a complement of two sets (subtracts B from A): <code>C = A \ B</code>

**Kind**: static property of [<code>Set</code>](#Set)  
**Returns**: <code>ExtendedSet</code> \| <code>\*</code> - A new Set with all elements of A minus the elements of B  
**Throws**:

- Throws an error if any of the argument is not a Set instance.


| Param | Description |
| --- | --- |
| set1 | A the set to be subtracted from |
| set2 | B the set which elements will be subtracted from A |

<a name="rules"></a>

## rules(value) ⇒ <code>function</code> \| <code>\*</code>
Pass a function that dictates the rules for elements to be part of this set.
Use without args to get the current rules function.

**Kind**: global function  
**Returns**: <code>function</code> \| <code>\*</code> - Returns the current rules Function if called without args, else nothing.  

| Param | Description |
| --- | --- |
| value | (Optional) a Function that obtains a single argument and returns either a truthy or falsey value. |

<a name="toArray"></a>

## toArray() ⇒ <code>Array</code>
Creates an array from all elements of this set in unsorted order.

**Kind**: global function  
**Returns**: <code>Array</code> - Array containing all elements of this set in unsorted order.  
<a name="each"></a>

## each(fct)
Executes a function on each element of the set.
The argument, that is passed is the current value of the iterator.

**Kind**: global function  

| Param | Description |
| --- | --- |
| fct | a function with a single argument (value) |

<a name="any"></a>

## any() ⇒ <code>T</code>
Returns an arbitrary element of this collection.
Basically the first element, retrieved by iterator.next().value will be used.

**Kind**: global function  
**Returns**: <code>T</code> - An arbitrary element of the current set.  
<a name="isSupersetOf"></a>

## isSupersetOf(set) ⇒ <code>boolean</code>
**Kind**: global function  

| Param |
| --- |
| set | 

<a name="isSubsetOf"></a>

## isSubsetOf(set) ⇒ <code>boolean</code>
**Kind**: global function  

| Param |
| --- |
| set | 

<a name="isProperSupersetOf"></a>

## isProperSupersetOf(set) ⇒ <code>boolean</code>
**Kind**: global function  

| Param |
| --- |
| set | 

<a name="isProperSubsetOf"></a>

## isProperSubsetOf(set) ⇒ <code>boolean</code>
**Kind**: global function  

| Param |
| --- |
| set | 

<a name="equal"></a>

## equal(set) ⇒ <code>boolean</code>
Checks, whether two sets are equal in terms of their contained elements.
Use the strict equals operator to determine, if they are equal in term of instances.

**Kind**: global function  

| Param |
| --- |
| set | 

<a name="toSet"></a>

## toSet(value) ⇒ [<code>Set</code>](#Set)
Autowraps a value to a Set, unless it is already a Set.

**Kind**: global function  
**Returns**: [<code>Set</code>](#Set) - A Set containing the value or the value if it is already a Set.  

| Param | Type | Description |
| --- | --- | --- |
| value | [<code>any</code>](#any) | Any arbitrary value |

<a name="symmetricDifference"></a>

## symmetricDifference(...args) ⇒ [<code>Set.&lt;any&gt;</code>](#any)
Creates the symmetric difference of an arbitrary number (2 .. n) of sets.

**Kind**: global function  

| Param |
| --- |
| ...args | 

<a name="powerSet"></a>

## powerSet(S) ⇒ <code>\*</code>
Creates the powerset of a set.

**Kind**: global function  

| Param |
| --- |
| S | 

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

