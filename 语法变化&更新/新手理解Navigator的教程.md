这是一个简单的例子，用`Navigator`来跳转页面，页面之间传递参数 (代码是ES6语法写的):

```
    import React from 'react';
    import {
        View,
        Navigator
    } from 'react-native';
    import FirstPageComponent from './FirstPageComponent';
    
    export default class SampleComponent extends React.Component {
        render() {
            let defaultName = 'FirstPageComponent';
            let defaultComponent = FirstPageComponent;
            return (
            <Navigator
              initialRoute={{ name: defaultName, component: defaultComponent }}
              configureScene={(route) => {
                return Navigator.SceneConfigs.VerticalDownSwipeJump;
              }}
              renderScene={(route, navigator) => {
                let Component = route.component;
                return <Component {...route.params} navigator={navigator} />
              }} />
            );
        }
    } 
```

这里来解释一下代码:

第三行: 一个初始首页的`component`名字，比如我写了一个`component`叫`HomeComponent`，那么这个`name`就是这个组件的名字【`HomeComponent`】了。

第四行: 这个组件的`Class`，用来一会儿实例化成 `<Component />`标签

第七行: `initialRoute={{ name: defaultName, component: defaultComponent }}`这个指定了默认的页面，也就是启动app之后会看到界面的第一屏。 需要填写两个参数: `name` 跟 `component`。

第八，九，十行: `configureScene={() => {return Navigator.SceneConfigs.VerticalDownSwipeJump;}}`这个是页面之间跳转时候的动画，具体有哪些？可以看这个目录下，有源代码的:`node_modules/react-native/Libraries/CustomComponents/Navigator/NavigatorSceneConfigs.js`

最后的几行: 
```
renderScene={(route, navigator) => {
let Component = route.component;
return <Component {...route.params} navigator={navigator} />
}} />
);
```
这里是每个人最疑惑的，我们先看到回调里的两个参数:`route`, `navigator`。通过打印我们发现`route`里其实就是我们传递的`name`,`component`这两个货，`navigator`是一个`Navigator`的对象，为什么呢，因为它有`push pop jump...`
等方法，这是我们等下用来跳转页面用的那个`navigator`对象。

```
return <Component {...route.params} navigator={navigator} />
```

这里有一个判断，也就是如果传递进来的`component`存在，那我们就是返回一个这个`component`，结合前面 `initialRoute` 的参数，我们就是知道，这是一个会被render出来给用户看到的`component`，然后`navigator`作为`props`传递给了这个`component`。

所以下一步，在这个`FirstPageComponent`里面，我们可以直接拿到这个 `props.navigator`:

```
import React from 'react';
import {
    View,
    Navigator
} from 'react-native';

import SecondPageComponent from './SecondPageComponent';

export default class FirstPageComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    _pressButton() {
        const { navigator } = this.props;
        //为什么这里可以取得 props.navigator?请看上文:
        //<Component {...route.params} navigator={navigator} />
        //这里传递了navigator作为props
        if(navigator) {
            navigator.push({
                name: 'SecondPageComponent',
                component: SecondPageComponent,
            })
        }
    }
    render() {
        return (
            <View>
                <TouchableOpacity onPress={this._pressButton.bind(this)}>
                    <Text>点我跳转</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
```

这个里面创建了一个可以点击的区域，让我们点击可以跳到`SecondPageComponent`这个页面，实现页面的跳转。
现在来创建`SecondPageComponent`，并且让它可以再跳回`FirstPageComponent`:

```
import React from 'react';
import {
    View,
    Navigator
} from 'react-native';

import FirstPageComponent from './FirstPageComponent';

export default class SecondPageComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    _pressButton() {
        const { navigator } = this.props;
        if(navigator) {
            //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到了上一个页面:FirstPageComponent了
            navigator.pop();
        }
    }

    render() {
    return (
            <View>
                <TouchableOpacity onPress={this._pressButton.bind(this)}>
                    <Text>点我跳回去</Text>
                </TouchableOpacity>
            </View>
    );
    }
}
```

大功告成，能进能出了。

关于官方文档里有个东西，这里说一下:

```
getCurrentRoutes() - 获取当前栈里的路由，也就是push进来，没有pop掉的那些
jumpBack() - 跳回之前的路由，当然前提是保留现在的，还可以再跳回来，会给你保留原样。
jumpForward() - 上一个方法不是调到之前的路由了么，用这个跳回来就好了
jumpTo(route) - Transition to an existing scene without unmounting
push(route) - Navigate forward to a new scene, squashing any scenes that you could jumpForward to
pop() - Transition back and unmount the current scene
replace(route) - Replace the current scene with a new route
replaceAtIndex(route, index) - Replace a scene as specified by an index
replacePrevious(route) - Replace the previous scene
immediatelyResetRouteStack(routeStack) - Reset every scene with an array of routes
popToRoute(route) - Pop to a particular scene, as specified by its route. All scenes after it will be unmounted
popToTop() - Pop to the first scene in the stack, unmounting every other scene
```

这些都是`navigator`可以用的`public method`,就是跳转用的，里面有些带参数的`XXX(route)`，新手第一次看这个文档会疑惑，这个`route`参数是啥呢，这个`route`就是:

```
renderScene={(route, navigator) => 
```

这里的`route`，最基本的`route`就是:

```
var route = {
    component: LoginComponent
}
```

这种格式。这个地方有点模糊的，在这里先说清楚了。

然后下面要讨论，怎么传递参数过去，或者从对方获取参数。
传递参数，通过`push`就可以了。
比如在一个`press`的事件里:

```
//FirstPageComponent.js
import React from 'react';
import {
    View,
    Navigator
} from 'react-native';

import SecondPageComponent from './SecondPageComponent';

export default class FirstPageComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: 2
        };
    }


    _pressButton() {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'SecondPageComponent',
                component: SecondPageComponent,
                //这里多出了一个 params 其实来自于<Navigator 里的一个方法的参数...
                params: {
                    id: this.state.id
                }
            });
        }
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={this._pressButton.bind(this)}>
                    <Text>点我跳转并传递id</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
```

`params`的来历:

```
// index.ios.js
<Navigator
  initialRoute={{ name: defaultName, component: defaultComponent }}
  configureScene={() => {
    return Navigator.SceneConfigs.VerticalDownSwipeJump;
  }}
  renderScene={(route, navigator) => {
    let Component = route.component;
    if(route.component) {
        //这里有个 { ...route.params }
        return <Component {...route.params} navigator={navigator} />
    }
  }} />
```

这个语法是把 `routes.params` 里的每个`key` 作为`props`的一个属性:

```
navigator.push({
    name: 'SecondPageComponent',
    component: SecondPageComponent,
    params: {
        id: this.state.id
    }
});
```

这里的 `params.id` 就变成了 `<Navigator id={}` 传递给了下一个页面。
所以 `SecondPageComponent`就应该这样取得 `id`：

```
//SecondPageComponent.js
import React from 'react';
import {
    View,
    Navigator
} from 'react-native';

import FirstPageComponent from './FirstPageComponent';

export default class SecondPageComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: null
        }
    }

    componentDidMount() {
        //这里获取从FirstPageComponent传递过来的参数: id
        this.setState({
            id: this.props.id
        });
    }

    _pressButton() {
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    render() {
        return (
            <View>
                <Text>获得的参数: id={ this.state.id }</Text>
                <TouchableOpacity onPress={this._pressButton.bind(this)}>
                    <Text>点我跳回去</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
```

这样在页面间传递的参数，就可以获取了。

很多人不理解这里的`params`，我忍不住稍微补充一下。
![image](http://bbs.reactnative.cn/uploads/files/1453170800064-qq%E5%9B%BE%E7%89%8720160119102616.png)

然后就是返回的时候，也需要传递参数回上一个页面:
但是`navigator.pop()`并没有提供参数，因为`pop()`只是从 [路由1,路由2，路由3。。。]里把最后一个路由踢出去的操作，并不支持传递参数给倒数第二个路由，这里要用到一个概念，把上一个页面的实例或者回调方法，作为参数传递到当前页面来，在当前页面操作上一个页面的`state`:

这是一个查询用户信息的例子，`FirstPageComponent`传递`id`到`SecondPageComponent`，然后`SecondPageComponent`返回`user`信息给`FirstPageComponent`

```
//FirstPageComponent.js
import React from 'react';
import {
    View,
    Navigator
} from 'react-native';

import SecondPageComponent from './SecondPageComponent';

export default class FirstPageComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: 2,
        user: null,
        }
    }


    _pressButton() {
        let _this = this;
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'SecondPageComponent',
                component: SecondPageComponent,
                params: {
                    id: this.state.id,
                    //从SecondPageComponent获取user
                    getUser: function(user) {
                        _this.setState({
                            user: user
                        })
                    }
                }
            });
        }
    }

    render() {
        if( this.state.user ) {
            return(
                <View>
                    <Text>用户信息: { JSON.stringify(this.state.user) }</Text>
                </View>
            );
        }else {
            return(
                <View>
                    <TouchableOpacity onPress={this._pressButton.bind(this)}>
                        <Text>查询ID为{ this.state.id }的用户信息</Text>
                    </TouchableOpacity>
                </View>
            );
        }

    }
}
```

然后再操作`SecondPageComponent`:

```
//SecondPageComponent.js

const USER_MODELS = {
    1: { name: 'mot', age: 23 },
    2: { name: '晴明大大', age: 25 }
};

import React from 'react';
import {
    View,
    Navigator
} from 'react-native';

import FirstPageComponent from './FirstPageComponent';

export default class SecondPageComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: null
        }
    }

    componentDidMount() {
        //这里获取从FirstPageComponent传递过来的参数: id
        this.setState({
            id: this.props.id
        });
    }

    _pressButton() {
            const { navigator } = this.props;
            
            if(this.props.getUser) {
                let user = USER_MODELS[this.props.id];
                this.props.getUser(user);
            }
                
            if(navigator) {
                navigator.pop();
            }
    }

    render() {
        return(
            <View>
                <Text>获得的参数: id={ this.state.id }</Text>
                <TouchableOpacity onPress={this._pressButton.bind(this)}>
                    <Text>点我跳回去</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
```

看下效果如何吧。

放个类似的例子代码: https://github.com/mozillo/navigation
安装方法: `npm install && react-native run-android`

原文地址：http://reactnative.cn/post/20