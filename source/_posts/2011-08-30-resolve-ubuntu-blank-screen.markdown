---
layout: post
title: 解决ubuntu中激活显卡驱动导致启动黑屏问题
category: ubuntu
---

今天重新安装了ubuntu，准备作为个人开发的主环境。

晚上的时候忽然蹦出来个激活硬件驱动的提示，我手贱了下随手就点了，结果重启后系统就进不去了，一直是黑屏，连ctrl+alt+F1都进不去。

## 解决方法

重启，在GRUB中按e进入编辑，删除quiet and splash，如果是Nvidia显卡添加nomodeset，如果是ATI显卡添加nomodeset xforcevesa

按ctrl+x启动，然后会提示说找不到桌面，这时可以进入命令行了，删掉xorg.conf

```bash
cd /etc/X11/
sudo rm xorg.conf
```

然后就可以正常startx了

