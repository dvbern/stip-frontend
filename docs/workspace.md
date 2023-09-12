# Workspace

## Generators & Executors

This workspace provides a set of generators and executors to automate the creation of new projects and libraries
which follow desired architecture to ensure maintainability and consistency across projects in this DV workspace.

Learn more about [@dv/tooling/nx-plugin](libs/tooling/nx-plugin/README.md).

Learn more about generators and executors in general in [Nx documentation](https://nx.dev/plugins/recipes/local-generators).

## Customization

### Generator default options

Some of the used generator options can be customized in the [nx.json](nx.json) file within the `generators` property.
This can be useful if you add additional Angular libraries which bring their own generator, and you want to customize their default options.

Additionally, default options can be evolved also for custom `@dv/tooling/nx-plugin` generators
by adjusting `libDefaultOptions` in the `libs/tooling/nx-plugin/src/generators/lib/types/<type>.ts` files
per library type.

## NgRx Tips

### Events (actions)

### Local selectors

When using NgRx, it makes sense to introduce selectors which are local to a given `feature` (or `pattern`)
instead of creating a selector which delivers perfect view for that feature as a part of the `data-access` library.

In general, there are 4 different scenarios:

1. The `feature` consumes plain state as provided by a single `data-access` library -> **`data-access` selector**
2. The `feature` consumes plain state as provided by multiple `data-access` libraries -> **`data-access` selector**
3. The `feature` consumes state as provided by a single `data-access` library, but it needs also `feature` specific derived state based on that original state which is unlikely to be useful for other features -> **local selector**
4. The `feature` consumes state as provided by a multiple `data-access` library, and it needs to combine that state in order to create derived state in a way which is unlikely to be useful for other features -> **local selector**

![Architecture overview](docs/selectors.png)
