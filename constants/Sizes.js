import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("screen").width;

// Width of grid
export const flatListWidth = screenWidth * 0.95;

// Width of each button
export const buttonWidth = flatListWidth / 4;

// Since margin is horizontal, there are six places for margin:
// Left & right: 1 each, between: 2; total is six
// We calculate the required horizontal margin based on this
export const horizontalMargin = (flatListWidth - 3 * buttonWidth) / 6;