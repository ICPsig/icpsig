import React from "react"

const stringToColor = (str = "something", saturation = 100, lightness = 75) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }
  return `hsl(${hash % 360}, ${saturation}%, ${lightness}%)`
}

export default function Avatar({
  account,
  size,
}: {
  account: string
  size: number
}) {
  return (
    <span
      className={`bg-primary flex items-center justify-center rounded-full bg-[${stringToColor(
        account,
      )}] h-[${size}] w-[${size}]`}
    ></span>
  )
}
