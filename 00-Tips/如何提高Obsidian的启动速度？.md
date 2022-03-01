---
source: https://tft脚本er.medium.com/improve-obsidian-startup-time-on-older-devices-with-the-faststart-script-70a6c590309f
---
> 本文摘抄自 [tft脚本er.medium.com](https://tft脚本er.medium.com/improve-obsidian-startup-time-on-older-devices-with-the-faststart-script-70a6c590309f)
> 本示例库已经内置此脚本，使用脚本后Ob启动速度基本都在2秒内。


黑曜石速度很快。这是它众所周知的事情之一；即使在较旧或功能较弱的设备上运行，它也很快！

但是，我发现 Obsidian 有一个很小的方面是缓慢的，那就是如果您使用许多插件（例如 25 个或更多），应用程序的启动时间。

在本文中，我将演示一个我一直在使用的脚本，用于提高 Obsidian 在“较慢”设备上的启动速度。该解决方案适用于 Obsidian、Windows、Android、Mac、Linux、iOS 等支持的任何平台。

虽然此 脚本 适用于所有设备，但主要目标是改善移动设备的启动，其中启动速度产生最显着的差异。

## 为什么要提高 Obsidian 的启动时间？

首先，让我说 Obsidian 速度很快，我对它的性能很满意。这绝不应该被视为对黑曜石的批评。让我们称其为必须被抓挠的个人瘙痒。

我在一些已有几年历史的设备上运行 Obsidian。Obsidian 在它们上运行良好，但我注意到随着我添加的插件越来越多，随着插件数量的不断增加，程序的启动时间越来越长。

在 PC 上，我不介意几秒钟的启动时间，但在我的 iPhone 11 和 iPad Pro 2018 上，启动时间需要 5 到 8 秒。我知道这时间不多，但我们希望应用程序在使用移动设备时几乎可以立即启动。

移动设备通常内存有限，因此当系统需要更多内存时，它们会在后台卸载程序。我在我的设备上发现黑曜石在进入后台时经常被卸载，因此每次我回到它时都需要重新加载。

对我来说，即使有一丝细微的延迟，我都会经历下意识的摩擦，这会导致我下意识地避免使用该程序。如果 Obsidian Mobile 几乎没有立即启动，我觉得不太愿意使用它。这很愚蠢，但这是我的现实。

## 我成功了吗？

是的！

在我的 iOS 设备上，启动时间在 5 到 8 秒之间，通常更接近后者。

目前，我的启动时间不到 2 秒，几乎看不到。

我是怎么做到的？请仔细阅读，找出答案。

但请继续阅读：这是一个相当复杂的 脚本，需要您自己进行一些测试和调整。这不是安装脚本，它为您解决了所有问题。

如果您没有时间通过仔细阅读这些说明并进行测试来节省几秒钟的 Obsidian 启动时间：停止！！！并阅读一些更有用的东西，比如埃莉诺的神话般的[黑曜石综述](https://www.obsidianroundup.org/)。但如果你有勇气和疯狂，请继续。

## 黑曜石是如何启动的

我将过度简化 Obsidian 在启动时所做的事情，但它必须做几件事才能让 Obsidian 准备好使用：

-   Obsidian 会初始化其内部内存缓存，这是一个有关您保管库中文件的信息数据库。
    
-   它向用户界面加载程序的可视元素（按钮、窗格、工作区等）。
    
-   如果您启用了插件，Obsidian 会开始一一加载插件。
    

> 缓存和用户界面的加载速度非常快，即使您有一个很大的保管库。但是，插件的加载可能需要几毫秒到几秒钟的时间，具体取决于启用的插件的数量。

有趣的是，在 Obsidian 完成这些初始化步骤之前，我们无法开始做任何工作。

但是，我意识到我安装的许多插件并不是我每天都使用的，而且在使用 Obsidian 的最初几分钟内我不需要很多插件。即便如此，我必须等待每次黑曜石启动时加载所有插件，即使它们当前与我想要执行的任务无关。这在移动设备上更多是一个问题，目标是快速捕获或引用您的保管库中的信息。这些都是简单的目标，不得不等待是痛苦的。

## 我加快启动速度的方法：FastStart 脚本

我想到如果我可以将特定插件的启动延迟到启动后稍晚一点，也许初始启动会更快。

我的理论如下：

1.  让 Obsidian 开始吧，只需启用几个关键插件。
    
2.  Obsidian 加载速度很快，因为只启用了几个插件，我可以开始处理我的文件。
    
3.  虽然我已经在处理文件，但经过短暂的延时后，在我工作时在后台加载我的其余插件。
    

令我惊讶的是，这非常有效。Obsidian 的启动速度要快得多，并且在短暂延迟后启动的插件在我工作时对性能没有负面影响。

我称这个脚本为 **FastStart**

## 这是如何实现的

结果很简单。正如我已经提到的，我只启用了从 Obsidian 刚开始时就需要的几个关键插件。

启用的这些插件之一是 Templater 插件。Templater 是一个在 Obsidian 中使用模板的插件。Templater 有两个有用的功能：

1.  它可以运行此 脚本 所需的 JavaScript 代码。
    
2.  它可以在 Obsidian 启动时运行脚本文件。
    

考虑到这一点，我创建了一个小文件或脚本，其中包含 Templater 将在启动时运行的 JavaScript 代码。短暂延迟后，这个小脚本将加载我确定可以推迟到以后启动的插件。

我将此脚本称为 FastStart，因为它可以让我在旧设备上更快地启动 Obsidian。

> 请注意，对于这个 脚本，你不需要知道如何用 JavaScript 编程。

## 设置

我们需要为这个 脚本 设置和配置一些东西。让我们一步一步来。在给出详细说明之前，让我为您简要介绍一下我们正在做的事情：

-   基准测试：在实施此 脚本 之前，在您的设备上记录 Obsidian 的启动时间。
    
-   禁用大多数插件（除了 Templater）。
    
-   为 Templater 创建两个文件并粘贴一些 JavaScript 代码。
    
-   创建一个包含 2 秒后开始的插件 ID 列表的文件。
    
-   创建第二个文件，其中包含 30 秒后开始的插件 ID 列表。
    
-   通过在两个列表之间移动插件 ID 进行实验。
    

现在让我们详细了解这些步骤。

## Templater 插件和 Templater 文件夹位置

首先，在 Obsidian 的 Community Plugin 设置屏幕中，安装 Templater Plugin。

安装后，打开 Templater 插件的设置，然后在 Template 文件夹位置，将 Vault 中的本地文件夹设置为模板文件夹。这是 Templater 用来查找所有模板和脚本的文件夹。我们将把我们的 FastStart 脚本放在这个文件夹中。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmiro.medium.com%2Fmax%2F1400%2F1*zrsbKmvBdHsY9K8UF44sxw.png)

黑曜石中的模板设置

## **FastStart-StartupScript 文件**

接下来，在上一步定义的文件夹中，**创建一个名为 FastStart-StartupScript 的文件**。此文件是我们将放置此解决方案的 JavaScript 代码的位置。

在您刚刚创建的文件**FastStart-StartupScript**中，将脚本的代码复制到此文件中。让我告诉你在哪里可以找到脚本的代码。转到此[链接](https://gist.github.com/TfT脚本er/29f838b51338a5c7f46b04973bd0f401)。它包含我们需要的代码。单击链接后，您应该会在浏览器中看到此页面：

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmiro.medium.com%2Fmax%2F1400%2F1*_f17PcUIDRaXvHBMT6kamA.png)

FastScript Javascript 代码

我用红色圈出了 JavaScript 代码。不要害怕它；它不会咬你。

这是 JavaScript 代码。选择它，复制它，然后将它粘贴到Obsidian 中的**FastStart-StartupScript文件中。**这就是 FastStart-StartupScript 在 Obsidian 中的样子。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmiro.medium.com%2Fmax%2F1400%2F1*lD7crUfVRyq4YQdkygdj2w.png)

> 注意：重要的是此文件不包含任何其他内容，仅包含您粘贴到文件中的代码。

## FastStart-GenerateListOfInstalledPlugins

现在在模板文件夹中，如上一步所做的那样，创建另一个名为_FastStart-GenerateListOfInstalledPlugins 的文件。_

使用此[链接](https://gist.github.com/TfT脚本er/94e9327e7310217ef5c98ed155b1f5e7)中的代码，将其粘贴到您刚刚在 Vault 中创建的文件中。该文件在您的 Vault 中应如下所示：

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmiro.medium.com%2Fmax%2F1400%2F1*i5MYer7lThEjOt0O1xm6eg.png)

## _FastStart-Plugins-ShortDelay 和 FastStart-Plugins-LongDelay_

接下来，在您的保管库中，您需要再创建两个文件。这些文件不应位于 Templater 使用的模板文件夹中，但可以存储在您喜欢的 Vault 中的任何位置。在您的 Vault 中创建这两个文件：

-   FastStart-插件-ShortDelay
    
-   FastStart-插件-LongDelay
    

每个文件的名称应与此处的名称完全相同。目前，这些文件是空的。

## 分配启动模板

打开 Templater 插件的设置屏幕，找到名为**Startup Templates**的部分。这是您定义模板的地方，或者在我们的例子中，是在 Obsidian 启动时由 Templater 加载的脚本文件。

需要明确的是，在 Obsidian 加载 Templater 插件后，Templer 将加载此处定义的任何脚本。

单击添加新启动模板并将其设置为我们的**FastStart-StartupScript**文件，如下面的屏幕所示：

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmiro.medium.com%2Fmax%2F1400%2F1*NnZnmantCg0Pof6lOlw4Kg.png)

现在，当 Templater 启动时，将加载**FastStart-StartupScript脚本文件。**

## 我们准备好了

我们已经完成了解决方案所需文件的初始设置。

## 调试

在我们进一步讨论之前，我建议记录下黑曜石在所有设备上加载所需的时间。

这将作为以后比较启动性能的基准。所以如果你有台式机和手机，在每台设备上启动 Obsidian 并记录下启动所需的时间，以秒为单位。

您要测试的不仅仅是 Obsidian 的启动，而是 Obsidian 何时真正变得有用以便您可以编辑文件。

有两种类型的基线可能对您有所帮助：

1.  记录 Obsidian 在不更改当前配置的情况下加载所有插件所需的时间。
    
2.  在社区插件设置屏幕中将您的设备置于“安全模式”并重新启动 Obsidian 也很好。记录在安全模式下需要多长时间。这个基线数字很有价值，因为它显示了在没有启用插件的情况下 Obsidian 需要多长时间，坦率地说，我们无法更改 Obsidian 本身需要多少时间。所以这个基线是可以添加任何优化之前的“最小”启动时间。
    

您可能还会发现在社区插件设置中启用调试启动时间很有帮助。它提供了有关插件启动所需时间的反馈：

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmiro.medium.com%2Fmax%2F1400%2F1*3p22F-rKOGo3O2j7kSnUJA.png)

我只会谨慎使用此功能；它不是一个精确的调试工具。我发现每次启动都会得到不同的结果。但它仍然很有价值。

## 配置快速启动

现在乐趣开始了。我们需要尝试找出哪些插件我们想从 Obsidian 启动，哪些插件应该等待延迟启动。这是一个反复试验的过程。

FastStart 基于插件启动的 3 个阶段：

1.  黑曜石应该加载哪些插件
    
2.  加载 Obsidian 后 2 秒应该启动哪些插件，并且您已经可以使用该程序
    
3.  哪些插件应在上一阶段后 30 秒加载。
    

同样，这个概念是逐步加载插件以优化 Obsidian 的启动时间。

## **第 1 步：启用/禁用以 Obsidian 开头的插件**

您需要在社区插件设置屏幕中打开插件列表。列出您已启用的所有插件。

开始禁用大部分插件，只留下您认为必须从 Obsidian 开始的插件。例如，我们需要从启动时启用 Templater。

就我个人而言，我启用了大约五个插件。其余被禁用。

## 第 2 步：定义在 Obsidian 启动几秒钟后应该启动哪些插件

之前，我们创建了一个名为_FastStart-Plugins-ShortDelay_的文件。该文件列出了在 Obsidian 初始化几秒钟后应该启动的所有插件。

在这个文件中，我定义了我迟早可能需要的插件，以及我知道的插件对 Obsidian 的性能影响不大。

在这个文件中，您需要列出每个插件在加载 Obsidian 后几秒钟后应该启动的列表。每个插件都应该在自己的行中，并且插件 ID 应该在文件中列出。

> **插件ID是什么？**您安装的每个插件都有一个名称和一个标识符（或简称 ID）。我们需要为 FastStart 提供插件的 ID，因为 ID 是识别已安装插件的唯一方式。

这是我的保险库中_的 FastStart-Plugins-ShortDelay_文件的样子：

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmiro.medium.com%2Fmax%2F1400%2F1*nD5dWtDWB1uG7krygdzuiA.png)

您可能认识其中一些插件，但也许您从未见过它们的 ID。

如何获取插件 ID？这就是我们之前制作的_FastStart-GenerateListOfInstalledPlugins_脚本发挥作用的地方。此 Templater 脚本将生成所有已安装插件及其插件 ID 的列表_。_

要使用此脚本，请在您的 Vault 中创建一个空白文件。然后从命令面板中，运行命令**Templater：打开插入模板：**

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmiro.medium.com%2Fmax%2F1400%2F1*ycJQHqG4VqMiIZtQdmrccQ.png)

然后从模板列表中选择_FastStart-GenerateListOfInstalledPlugins。_

此脚本应生成所有插件的文件。这是我在黑曜石阅读视图中的列表：

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmiro.medium.com%2Fmax%2F1400%2F1*s0538hudvPNk8DUUE4On4g.png)

从这里，您可以找到所有插件的 ID。

您现在的工作是在您的保管库中的_FastStart-Plugins-ShortDelay 文件_中添加您想要在 Obsidian 启动几秒钟后启动的插件的 ID。同样，您可以查看我之前从保险库中显示的屏幕截图，看看您的屏幕应该是什么样子。

## 第 3 步：定义稍后应该启动的插件

现在我们要打开我们在 Vault 中创建的_FastStart-Plugins-LongDelay文件。_该文件将包含我们要启动的其余插件，但稍晚一些。这是我的样子：

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmiro.medium.com%2Fmax%2F1400%2F1*EJtWI9gyRQVoowDIgGHDnA.png)

如您所见，此文件类似于_FastStart-Plugins-ShortDelay_。它是相同的。它是插件 ID 的列表。

> 注意：您现在可以在这两个文件之间移动插件 ID，并且无需重复在设置中禁用插件的第 1 步。我强烈建议尝试以各种组合测试插件，以找到为您的设备加载插件的最快方法，无论是在第 2 步或第 3 步的文件中。

## 调试结果

我们已将一些插件配置为从 Obsidian 启动，其他插件在 Obsidian 加载几秒钟后启动，其余插件在稍后的短时间内启动。

现在在您的设备上重新启动 Obsidian，并像之前所做的那样，调试 Obsidian 启动所需的秒数。

希望您会在应用程序启动时看到设备的性能显着提升。

## 尝试

每个插件都是独一无二的。当我完成这个过程时，我尝试了每个插件的加载时间。

只有一条规则：**必须启用 Templater 插件**。

您将不得不测试其余的插件以查看您希望它们何时加载。

> 注意：有些插件不喜欢稍后启动，或者只是表现得很奇怪。因此，在您的实验中，如果某个插件没有运行，请在设置中启用它，使其以 Obsidian 开头。不喜欢延迟启动的插件示例：自定义页面标题和标题栏，以及间隔重复。

如果启动时间不快，您将需要尝试插件的加载方式，直到加载速度更快。这个过程花了我几个小时的试验，但正如我所提到的，我现在的加载时间不到两秒。

## 调整时间

如果您想为您的设备优化插件的延迟启动，您可以在 FastStart-StartupScript 文件的 Javascript 代码中更改两个值。

默认情况下，这些脚本在 2 秒后加载第一组插件，在 30 秒后加载第二组插件。这些数字在这张图片中突出显示：

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmiro.medium.com%2Fmax%2F1400%2F1*2Q4kWJMsuRFamMn1AeEiow.png)

您可以通过更改数字来增加或减少这些延迟时间。例如，在一些速度较慢的设备上，您可能希望在 Obsidian 启动后等待 5 到 10 秒，因此将数字从 2 更改为 5。

我现在在我的设备上将这些启动时间设置为 1 秒和 5 秒。我仍然可以快速启动，并且插件在后台加载，我没有感觉到任何性能损失。这些 iOS 设备具有良好的处理器，似乎即使是在启动时加载插件的这种小延迟也是改善启动时间所需要的。

## 结论

如前所述，这个脚本需要反复试验来调整所有这些设置，直到它们针对您的设备和您的需求进行优化。

对我来说，努力得到了回报。我的移动设备上的 Obsidian 启动非常快，我不再感觉到在我的移动设备上打开 Obsidian 时的潜意识心理摩擦。

如果您实施此 脚本，我将不胜感激。请向我发送一条推文，其中包含基准测试之前和之后的任何经验教训。

