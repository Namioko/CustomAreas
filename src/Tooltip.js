import jBox from "jbox";

export const Tooltip = ({id, targetId, title, content, onCreated, offset}) => {
    return title || content
        ? new jBox("Tooltip", {
            id,
            trigger: "mouseenter",
            attach: `#${targetId}`,
            position: {x: "right", y: "top"},
            adjustPosition: true,
            adjustDistance: 5,
            title,
            content,
            closeOnMouseleave: true,
            onCreated,
            delayClose: 200,
            offset
        })
        : undefined;
};