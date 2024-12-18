import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

export function transformImport(existingCode: string, importCode: string) {
  // 解析现有的代码为 AST
  const existingAst = parse(existingCode, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  // 解析待添加的 import 语句为 AST
  const addImportAst = parse(importCode, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  // 创建一个 Map 存储待添加的 import 语句，按 source value 索引
  const existingImportAstMap = new Map();
  existingAst.program.body.forEach((item: any) => {
    if (item.type === "ImportDeclaration") {
      existingImportAstMap.set(item.source.value, item);
    }
  });

  const importStatements: {
    code: string;
    line: number;
  }[] = [];

  // 遍历现有的 AST，处理 ImportDeclaration
  traverse(addImportAst, {
    ImportDeclaration(path) {
      const sourceValue = path.node.source.value;
      const isExisting = existingImportAstMap.has(sourceValue);
      if (isExisting) {
        // 合并导入项
        const addImportSpecifiers = path.node.specifiers;
        const existingSpecifiers =
          existingImportAstMap.get(sourceValue).specifiers;

        existingSpecifiers.forEach((specifier: any) => {
          // 如果已有的导入语句中没有这个 specifier，则将其添加进去
          if (
            !addImportSpecifiers.some(
              (existing) => existing.local.name === specifier.local.name
            )
          ) {
            if (t.isImportDefaultSpecifier(specifier)) {
              addImportSpecifiers.unshift(specifier);
            } else {
              addImportSpecifiers.push(specifier);
            }
          }
        });

        // 处理默认导入
      }

      importStatements.push({
        //   如果不存在添加一个换行
        code: generate(path.node).code + (isExisting ? "" : "\n"),
        line: isExisting
          ? existingImportAstMap.get(sourceValue).loc.start.line
          : -1,
      });
    },
  });

  return importStatements;
}
const code = `
import {useCallback, useContext, useEffect} from 'react';

import {useRequest} from 'ahooks';
import {message} from 'antd';
`;

const importStr = `
import { useState} from 'react';
`;

transformImport(code, importStr);
