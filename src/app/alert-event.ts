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
      notification.create(props.type, props.title, props.content)
    })
  }
}

export default Alert
