// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// @ts-nocheck
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import event from 'src/utils/mitt'

class Alert {
  constructor(message: NzMessageService, notification: NzNotificationService) {
    event.on('MESSAGE', (props: any) => {
      message[props.type](props.content)
    })

    event.on('NOTIFICATION', (props: any) => {
      notification.create(props.type, props.title, props.content, props.config)
    })
  }
}

export default Alert
