/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { MenuItem, MenuItemProps } from "@itwin/itwinui-react";
import React from "react";

export interface ContextMenuBuilderItem<T = any>
  extends Omit<MenuItemProps, "onClick" | "value"> {
  key: string;
  visible?: boolean | ((value: T) => boolean);
  onClick?: ((value?: unknown) => void) | undefined;
}

/** Build MenuItem array for the value for each provided options
 * @private
 */
export const _buildManagedContextMenuOptions: <T>(
  options: ContextMenuBuilderItem<T>[] | undefined,
  value: T
) => JSX.Element[] | undefined = (options, value) =>
  options
    ?.filter?.(({ visible }) => {
      return typeof visible === "function" ? visible(value) : visible ?? true;
    })
    .map(({ key, visible, ...contextMenuProps }) => {
      return <MenuItem {...contextMenuProps} key={key} value={value} />;
    });
