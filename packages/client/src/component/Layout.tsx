import React from "react";
import {Flex} from "@react-spectrum/layout";
import {FlexProps} from "@react-types/layout";

interface Props extends FlexProps {}

export function Layout({children}: Props) {
    return <Flex direction="column">{children}</Flex>;
}
