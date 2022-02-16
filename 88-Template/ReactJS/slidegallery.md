---
defines-react-components: true
---

```jsx:component:Slidegallery
//感谢锋华提供代码思路
let images = []
let folders = ["99-Attachment/banner"]

  function parseSource(src) {
 
        // Absolute paths (legacy), relative paths (legacy), & URLs
        const path = src.startsWith('/') ? src.slice(1) : src;
        const file = app.vault.getAbstractFileByPath(path);
        return (file instanceof obsidian.TFile) ? app.vault.getResourcePath(file) : src;
    }

for(let i = 0; i < folders.length; i++)  images = images.concat(app.fileManager.vault.fileMap[folders[i]].children)

//console.log(images);
//const imageInfo = props.src.split("\n")
const imageList = []
const imgStyle = {
	width: "150px",
	objectFit: "cover"
};
const imageListStyle ={
    width: "110%",
    flexFlow: "wrap",
    display: "flex",
    gap: "10px"
}
images.forEach((el,index)=>{
	imageList.push({
		caption: el.name,
		src: parseSource(el.path),
		index: index
	})
})
imageList.pop()

const [imageIndex,setImageIndex] = useState(0)
const imageListRender = imageList.map(el=>{
	return (
		<img src={el.src} style={imgStyle} onClick={()=>setImageIndex(el.index)}/>
	)
})

return (
	<div className="slide-gallery">
		<div className="image-container" style={{width:"50%",height:"280px",lineHeight:"280px",margin:"auto"}}>
			<img src={imageList[imageIndex].src} style={{verticalAlign:"moddle",width:"100%"}}/>
		</div>
		<div className="caption-container" style={{textAlign: "center"}}>
		    <p id="caption">{imageList[imageIndex].caption}</p>
		</div>
		<div className="imageList-container" style={imageListStyle}>
			{imageListRender}
		</div>
	</div>
)

```

```jsx::Slidegallery

```