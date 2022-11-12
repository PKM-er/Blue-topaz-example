---
aliases: Demo Note
tags: 
cssclass:
source:
created: 2022-10-25 11:10:42
updated: 2022-10-25 11:35:25
---

# Demo Note
 
 #bluetopaz #demo  #tag1 #tag2 #tag3 #tag4 #tag5 #tag6
## Column and md syntax 
```ad-flex
> [!example]  In the notes, it is unavoidable to some emphasis ways, such as bold, highlighting, etc. 
> *italic*
> **bolded**
> ***bolded italic***
> `In-line code (also used as emphasis)`
> ==Highlighting==
> ==*italic highlighting*==
> *==Sign works in reverse==*
> ==**Bold highlighting**== 
> ==***bold italic highlighting***==
> ==Highlighting `in-line code`==

> [!info] Read it, try it, it's a how-to guide to help you understand some of the syntax and help you better get to know topaz
>   
>> [!bug|center]  Tang Poems 
>>[唐] [颜真卿]
>>
>>三更灯火五更鸡，*==~~正是男儿读书时~~==*。
>>==~~黑发不知勤学早~~==，白首方悔读书迟。
>
>
>```ad-lem
> title:👉 Embed Callout Formula 
> 
> $$
> \left|
> \begin{array}{cccc} 
>  3  &  2   \\ 
>  4  &  3  
> \end{array}
> \right| 
> = 3*3-2*4
> $$
>```
```

_Type any words here to replace these text between the first * and the last * . Do not leave any blank after the first *. in **Reading** mode, you only see text without any **markdown marks**, including the first and the last *._


---


## Table & Highlight Text & Callout
>[!infobox|noicon|right 40%]+ ####  **Karl Marx**
>
![Karl Marx 001.jpg|100](https://bkimg.cdn.bcebos.com/pic/a044ad345982b2b795c22d8438adcbef76099b14?x-bce-process=image/resize,m_lfit,w_440,limit_1/format,f_auto)<center><small> 5 May 1818 – 14 March 1883</small></center>
>
|     What you got     |         What you typed         |
|:--------------------:|:------------------------------:|
|    ==your words==    |       \=\=your words\=\=       |
|   *==your words==*   |     \*\=\=your words\=\=\*     |
|  ==**your words**==  |   \=\=\*\*your words\*\*\=\=   |
| ==***your words***== | \=\=\*\*\*your words\*\*\*\=\= |
|  **==your words==**  |   \*\*\=\=your words\=\=\*\*   |
| ***==your words==*** | \*\*\*\=\=your words\=\=\*\*\* |

### Embed images
You can embed markdown images in your notes. Use the `![title](XX.jpg)` syntax like so:
![Engelbart.jpg|190](https://images.computerhistory.org/tdih/30january-1.jpg?w=600)[img-caption:: Figure 1. Doug Engelbart]

---
 #bluetopaz #demo  #tag1 #tag2 #tag3 #tag4 #tag5 #tag6
 _italic_  **bolded**  **_bolded italic_**

> [!blank|left 40%]
> 
> ## List
> - aaa
> 	- aaa
> 		- 4444
> 		- aaa
> 			- 33333
> 				- 4444
> 					- 444
> 			- 4444 
> 		- aaa
> 	- 5555
> - 55555


> [!blank|left 30%]
> ## Order List
> 1. aaa
> 2. aaa
> 	   1. 2222
> 	   2. 2333
>  3. 2222
> 	   1. 222
> 	   2. 222
>  4. 444
> 	   1. 333
> 	   2. 444
>  5. 666666
>


> [!blank|left 30%]
> ## Check list
> - [x] 一级
> 	- [x] 222
> 	- [ ] 4444
> - [ ] 1111
> 	- [ ] 2222
> 	- [ ] 2222
> 		- [ ] 333
> 		- [ ] 3333
> 	- [ ] 2222
> - [ ] 11111
> - [x] 2222
> 


### Title of Images
![[obsidian_image.png#right|Figure 2. No, it is not an egg!|140]]
Put `#centre` / `#center`,`#right` or `#left` after `ImageFileName`, like `![[xxx.png#position|captions|size]]`
Egg or not? Egg? Yes! No! Egg? No! Yes! Egg? Yes, It is an egg! No, it is NOT an egg! Egg? Yes, It is an egg! It is a GOOD egg! No, it is NOT an egg! It is 😒😒😒！Egg or not? Egg? Yes! No! Egg? No! Yes! Egg? Yes, It is an egg! No, it is NOT an egg! Egg? Yes, It is an egg! It is a GOOD egg! No, it is NOT an egg! It is 😒😒😒！Egg or not? Egg? Yes! No! Egg? No! Yes! Egg? Yes, It is an egg! No, it is NOT an egg! Egg? Yes, It is an egg! It is a GOOD egg! No, it is NOT an egg! It is 😒😒😒！Egg or not? Egg? Yes! No! Egg? No! Yes! Egg? Yes, It is an egg! No, it is NOT an egg! Egg? Yes, It is an egg! It is a GOOD egg! No, it is NOT an egg! It is 😒😒😒！
It shows below! You may need to maximum widen your screen to see what is looks like.
![[obsidian_image.png#inl|Figure 1. This is an egg!|170]]![[obsidian_image.png#inl|Figure 2. This is NOT an egg!|100]]![[obsidian_image.png#inl|Figure 3. Is this an egg?|130]]![[obsidian_image.png#inl|Figure 4.  Obsidian.|100]]

---


## Pseudo-Kanban & Checkbox
```ad-kanban
- [ ] Unchecked `- [ ]`
- [x] Checked `- [x]`
- [>] Rescheduled `- [>]`
- [<] Scheduled `- [<]`
- [!] Important `- [!]`
- [-] Cancelled `- [-]`
- [/] In Progress `- [/]`
- ["] Quote`- ["]`
- [?] Question `- [?]`
- [*] Star `- [*]`
- [n] Note `- [n]`
- [l] Location `- [l]`
- [i] Information `- [i]`
- [I] Idea `- [I]`
- [S] Amount `- [S]`
- [p] Pro `- [p]`
- [c] Con `- [c]`
- [b] Bookmark `- [b]`
- [f] Fire `- [ f ]`
- [w] Win `- [w]`
- [k] Key `- [k]`
- [u] Up `- [u]`
- [d] down `- [d]`
- [F] Feature `- [F]`
- [r] Rule `- [r]`
- [m] Measurement `- [m]`
- [M] Medical `- [M]`
- [L] Language `- [L]`
- [t] Clock `- [t]`
- [T] Telephone `- [T]`
- [P] Person `- [P]`
- [#] Tags `- [#]`
- [W] World `- [W]`
- [U] Universe `- [U]`
```

### Callout style

> [!timeline] Cornell Notes
>> These contents will be shown in left column
>--- 
>These contents will be shown in right column
> 
>>From here, the contents will be in left column.
>
>Leave a blank to start right column contents.
>More contents in right column.
>
>>Contents in left column
>
>Right column contents
>
>> After finish left contents input, press <kbd>**==enter==**</kbd> twice.
>
>Right column contents again
>More contents in right column
>for more completed **markdown** syntax support example, refer below example in Chinese
