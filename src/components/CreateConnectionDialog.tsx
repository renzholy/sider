import React, { useState } from 'react'
import {
  Dialog,
  InputGroup,
  Classes,
  RadioGroup,
  Radio,
  Divider,
  FormGroup,
  Button,
  Intent,
} from '@blueprintjs/core'

enum ConnectionType {
  Simple = 'Simple',
  Cluster = 'Cluster',
  Failover = 'Failover',
}

export function CreateConnectionDialog(props: {
  isOpen: boolean
  onClose(): void
}) {
  const [connectionType, setConnectionType] = useState(ConnectionType.Simple)

  return (
    <Dialog
      icon="plus"
      title="Create connection"
      isOpen={props.isOpen}
      onClose={props.onClose}>
      <div className={Classes.DIALOG_BODY} style={{ display: 'flex' }}>
        <RadioGroup
          label="Type"
          selectedValue={connectionType}
          onChange={(e: any) => {
            setConnectionType(e.target.value)
          }}>
          <Radio label={ConnectionType.Simple} value={ConnectionType.Simple} />
          <Radio
            label={ConnectionType.Cluster}
            value={ConnectionType.Cluster}
          />
          <Radio
            label={ConnectionType.Failover}
            value={ConnectionType.Failover}
          />
        </RadioGroup>
        <Divider style={{ margin: '0 20px' }} />
        {connectionType === ConnectionType.Simple ? (
          <div style={{ flex: 1 }}>
            <FormGroup label="Name">
              <InputGroup fill={true} />
            </FormGroup>
            <FormGroup label="Address" labelInfo="(required)">
              <InputGroup fill={true} />
            </FormGroup>
            <FormGroup label="Username">
              <InputGroup fill={true} />
            </FormGroup>
            <FormGroup label="Password">
              <InputGroup fill={true} />
            </FormGroup>
          </div>
        ) : (
          <div>Comming soon.</div>
        )}
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button text="Create" minimal={true} intent={Intent.PRIMARY} />
        </div>
      </div>
    </Dialog>
  )
}
