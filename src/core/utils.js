/*\
title: $:/plugins/noteself/core/utils
type: application/javascript
module-type: utils

Add utils method to $tw.utils

@preserve

\*/

'use strict';

/**
 * @function setTags
 * @description Helper function to override the tags of a tiddler
 * If the tiddler does not exist it will be created
 * @param  {String} title Tiddler you want to override its' tags
 * @param  {[String]} tags  List of tags that will be the new tiddler tags
 * @return {Void} This function does not return anything
 */
exports.setTags = (title, tags) => {
    $tw.wiki.addTiddler(
        new $tw.Tiddler(
            $tw.wiki.getTiddler(title),
            {title, tags}
        )
    )
};
