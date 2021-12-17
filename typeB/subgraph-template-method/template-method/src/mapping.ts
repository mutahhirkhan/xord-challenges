import {
  ChildGeneration,
} from "../generated/Parent/Parent"
import { ParentEntity, ChildEntity } from "../generated/schema"
import { Initialize } from './../generated/templates/Child/Child';

export function handleChildGeneration(event: ChildGeneration): void {
  let entity = ParentEntity.load(event.transaction.hash.toHex())

  if (!entity) {
    entity = new ParentEntity(event.transaction.hash.toHex())
  }
  entity._name = event.params._name;
  entity._parentAddress = event.params._parentAddress
  entity._childNumber = event.params._childNumber

  entity.save()
}


export function handleInitialize(event: Initialize): void {
  let entity = ChildEntity.load(event.transaction.hash.toHex())

  if (!entity) {
    entity = new ChildEntity(event.transaction.hash.toHex())
  }
  entity.id

  entity._parentAddress = event.params._parentAddress
  entity._childAddress = event.params.childAddress
  entity._name = event.params._name
  entity.save()
}
