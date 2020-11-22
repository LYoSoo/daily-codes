### React源码笔记





```javascript
	//JSX 组件开头字母一定要大写，因为 JSX 转换 之后
	function Com(){
		return(<div>这是组件</div>)
    }
	//之后使用 Com
	<Com></Com>		//转换后 React.createElement(Com, null); 可以看到Com是变量的形式
    //如果是小写字母
    <com></com>		//转换后 React.createElement("com", null);  可以看到 com 是字符串的形式
	
```

​	react => src => ReactElement.js

> ​	const RESERVED_PROPS  主要作用是移除掉一些特殊的props，是子元素访问时能够过滤掉一些不是传给他的props，比如key, ref等；
>
> ​	hasValidRef、 hasValidKey判断是否为有效的 Ref 和有效的  Key
>
> ​	方法 createElement 传入3个参数  分别为 类型、config、children。	类型就是判断是否为原生的标签或者组件、config就是一些ID class 之类的   children  是内部的子组件
>
> ​	193行遍历config	 如果不是RESERVED_PROPS  包含的内容  则 放进 props内部。
>
> ​	205行判断 传入的参数个数，如果传入3个参数  说明只有最后一个是children  所以 props.children = children;
>
> ​	大于3个  就循环  把所有的参数放进 props.children 内部。
>
> ​	222行是否存在 defaultProps	如果 props[propName] = undefined； 使用默认值，  null的时候默认认为他有值
>
> ```javascript
> 	class Demo extends React{
>         constructor(props){
>             super(props);
>             console.log(props);		//{value: 1};
>         }
>     }
> 	Demo.defaultProps = {value: 1};
> 	export default Demo;
> ```
>
> 

​	react => src => ReactBaseClasses

> ​	主要是 React里面的  Component 和 PureComponent;
>
> ​	Component里面的 setState 方法， 是引用外部的React Dom的   因为 React Nactive和 React Dom 实现方法不一样 所以在外部分别引用
>
> ```javascript
> 	//125行 	实际上是 PureComponent  通过 ComponentDummy 实现了继承  Component;
>  	function ComponentDummy() {}
> 	ComponentDummy.prototype = Component.prototype;
> 	const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
>     pureComponentPrototype.constructor = PureComponent;
>     // Avoid an extra prototype jump for these methods.
>     Object.assign(pureComponentPrototype, Component.prototype);
>     pureComponentPrototype.isPureReactComponent = true;		//唯一增加了 isPureReactConmonent = true 标识符
> ```
>
> 