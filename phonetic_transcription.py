
import argparse
import collections
import sys

Row = collections.namedtuple('Row', ['number', 'target', 'rendition'])

def parse_args(args):
    parser = argparse.ArgumentParser()

    parser.add_argument('input')
    parser.add_argument('output')

    return parser.parse_args(args)


def main(input, output):
    with open(input, 'r') as infile:
        lines = infile.read().split('\n')

    # strip blank lines
    lines = [line for line in lines if line != '']

    pairs = []
    for i in range(len(lines)/2):
        pairs.append((lines[i*2], lines[i*2+1]))

    rows = []
    for target, rendition in pairs:
        print(target, rendition)
        first_period = target.find('.')
        num = int(target[:first_period])

        target = target[first_period+1:]
        targets = target.split()

        rendition = rendition.strip('[]')
        renditions = rendition.split()

        assert(len(renditions) == len(targets)), 'line {}: {} != {}'.format(
            num,
            len(renditions),
            len(targets))

        for i in range(len(targets)):
            rows.append(Row(num, targets[i], renditions[i]))

    def row_cmp(x, y):
        return cmp(x.target.lower(), y.target.lower())

    rows = sorted(rows, cmp=row_cmp)

    with open(output, 'w') as outfile:
        rownum = 0
        for row in rows:
            rownum += 1
            outfile.write('{}. {},{},{}\n'.format(
                rownum,
                row.target,
                row.number,
                row.rendition))

if __name__ == '__main__':
    args = parse_args(sys.argv[1:])
    main(args.input, args.output)