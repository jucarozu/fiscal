import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
	name: "filterPipe"
})

export class FilterPipe implements PipeTransform
{
	transform(value: any, args: string[]): any
	{
		let filter = args[0];

		if (filter && Array.isArray(value))
		{
			let filterKeys = Object.keys(filter);

			return  value.filter(item =>
						filterKeys.reduce((memo, keyName) =>
							memo && item[keyName].toString().toLocaleLowerCase().indexOf(filter[keyName].toLocaleLowerCase()) != -1, true
						)
					);
		}
		else
		{
			return value;
		}
	}
}