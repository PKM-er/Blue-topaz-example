---
cssclass: code-wrap
usage: 代码块自动换行
---

> 这是一个代码块自动换行的样式示例，需要在yaml区域声明cssclass

---

```css
.tag[href^="#questions"] {
  background-color: var(--tag-questions-bg) !important;
  font-weight: 600;
  font-family: var(--font-family-special-tag) !important;
  color: var(--white) !important;
  border: none;
}

.tag[href^="#questions"]::after {
  content: ' ❓';
  font-size: var(--font-size-emoji-after-tag);
}

.cm-s-obsidian .CodeMirror-line span.cm-tag-questions:not(.cm-formatting-hashtag)::after {
  content: ' ❓';
}

.cm-s-obsidian .CodeMirror-line span.cm-hashtag.cm-meta.cm-hashtag-end.cm-tag-questions:not(.cm-formatting-hashtag) {
  font-family: var(--font-family-special-tag) !important;
  font-weight: 600;
  background-color: var(--tag-questions-bg);
  color: var(--white) !important;
  border: none;
}
```

这也是制作特别标签的模板，把上面“questions”全部替换成你自己想要的词，做成一个css片段，就可以有自己的特别标签了