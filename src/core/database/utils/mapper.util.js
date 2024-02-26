function columnMapper(table, columns, row) {
  return Object.fromEntries(
    columns.map((column) => {
      return [column, row[`${table}_${column}`]];
    }),
  );
}

export function rowsMapper(rows, options) {
  return rows.reduce((result, row) => {
    const rowId = row[`${options.table}_id`];
    const rowIndexInResult = result.findIndex((resultItem) => {
      return resultItem.id === rowId;
    });

    if (rowIndexInResult === -1) {
      const rowRelations = Object.fromEntries(
        Object.entries(options.relations).map(([name, relation]) => {
          const relationId = row[`${relation.table}_id`];

          if (relation.single) {
            return [
              name,
              relationId
                ? {
                    id: relationId,
                    ...columnMapper(relation.table, relation.columns, row),
                  }
                : {},
            ];
          }

          return [
            name,
            relationId
              ? [
                  {
                    id: relationId,
                    ...columnMapper(relation.table, relation.columns, row),
                  },
                ]
              : [],
          ];
        }),
      );

      return [
        ...result,
        {
          id: rowId,
          ...columnMapper(options.table, options.columns, row),
          ...rowRelations,
        },
      ];
    }

    const rowRelations = Object.fromEntries(
      Object.entries(options.relations).map(([name, relation]) => {
        const relationId = row[`${relation.table}_id`];

        if (relation.single) {
          return [
            name,
            result[rowIndexInResult].hasOwnProperty(name)
              ? result[rowIndexInResult][name]
              : {
                  id: relationId,
                  ...columnMapper(relation.table, relation.columns, row),
                },
          ];
        }

        return [
          name,
          [
            ...result[rowIndexInResult][name],
            {
              id: relationId,
              ...columnMapper(relation.table, relation.columns, row),
            },
          ],
        ];
      }),
    );

    result[rowIndexInResult] = {
      ...result[rowIndexInResult],
      ...rowRelations,
    };

    return result;
  }, []);
}
