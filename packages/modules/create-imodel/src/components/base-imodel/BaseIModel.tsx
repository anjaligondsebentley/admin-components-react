/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./BaseIModel.scss";

import {
  Button,
  LabeledInput,
  LabeledTextarea,
  ProgressRadial,
  Title,
} from "@itwin/itwinui-react";
import React from "react";

import { BaseIModel } from "../../types";

export type BaseIModelProps = {
  /** Callback on canceled action. */
  onClose?: () => void;
  /** Callback on action. */
  onActionClick?: (imodel: BaseIModel) => void;
  /** Object of string overrides. */
  stringsOverrides?: {
    /** The title of the page. */
    titleString?: string;
    /** iModel name property. */
    nameString?: string;
    /** iModel description property. */
    descriptionString?: string;
    /** Confirm button string. */
    confirmButton?: string;
    /** Cancel button string. */
    cancelButton?: string;
    /** Error message when name is too long. */
    nameTooLong?: string;
    /** Error message when description is too long. */
    descriptionTooLong?: string;
  };
  /** If action is loading. */
  isLoading?: boolean;
  /** Initial iModel state used for update. */
  initialIModel?: BaseIModel;
};

const MAX_LENGTH = 255;

export function BaseIModelPage(props: BaseIModelProps) {
  const {
    onClose,
    onActionClick,
    initialIModel,
    isLoading = false,
    stringsOverrides,
  } = props;
  const [imodel, setImodel] = React.useState<{
    name: string;
    description: string;
  }>({
    name: initialIModel?.name ?? "",
    description: initialIModel?.description ?? "",
  });

  const updatedStrings = {
    titleString: "Create an iModel",
    nameString: "Name",
    descriptionString: "Description",
    confirmButton: "Create",
    cancelButton: "Cancel",
    nameTooLong: `The value exceeds allowed ${MAX_LENGTH} characters.`,
    descriptionTooLong: `The value exceeds allowed ${MAX_LENGTH} characters.`,
    ...stringsOverrides,
  };

  const onPropChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.persist();
    setImodel((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value ?? "",
    }));
  };

  const isPropertyInvalid = (value: string) => {
    return value.length > MAX_LENGTH;
  };

  const isDataValid = () => {
    return (
      !!imodel.name.length &&
      !isPropertyInvalid(imodel.name) &&
      !isPropertyInvalid(imodel.description)
    );
  };

  const isDataChanged = () => {
    return (
      imodel.name !== initialIModel?.name ||
      imodel.description !== initialIModel?.description
    );
  };

  return (
    <>
      <div className="iac-imodel-base">
        <div>
          <Title>{updatedStrings.titleString}</Title>
          <div className="iac-inputs-container">
            <LabeledInput
              label={updatedStrings.nameString}
              name="name"
              setFocus
              required
              value={imodel.name}
              onChange={onPropChange}
              message={
                isPropertyInvalid(imodel.name)
                  ? updatedStrings.nameTooLong
                  : undefined
              }
              status={isPropertyInvalid(imodel.name) ? "negative" : undefined}
            />
            <LabeledTextarea
              label={updatedStrings.descriptionString ?? "Description"}
              name="description"
              value={imodel.description}
              onChange={onPropChange}
              rows={4}
              message={
                isPropertyInvalid(imodel.description)
                  ? updatedStrings.descriptionTooLong
                  : undefined
              }
              status={
                isPropertyInvalid(imodel.description) ? "negative" : undefined
              }
            />
          </div>
        </div>
        <div className="iac-button-bar">
          <Button
            styleType="cta"
            disabled={!isDataChanged() || !isDataValid() || isLoading}
            onClick={() => onActionClick?.(imodel)}
          >
            {updatedStrings.confirmButton}
          </Button>
          <Button onClick={onClose}>{updatedStrings.cancelButton}</Button>
        </div>
        {isLoading && <OverlaySpinner />}
      </div>
    </>
  );
}

function OverlaySpinner() {
  return (
    <div className="iac-overlay-container">
      <ProgressRadial indeterminate />
    </div>
  );
}